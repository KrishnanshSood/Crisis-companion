import 'dotenv/config';
import bolt from '@slack/bolt';
import { runPipeline, extractActionToken } from './lib/pipeline.js';
import { buildWelcome } from './blocks/response.js';
import { registerHome } from './listeners/home.js';
import { registerActions } from './listeners/actions.js';

const { App, Assistant, LogLevel } = bolt;

const DEBUG = process.env.DEBUG_EVENTS === 'true';

function allowedChannels() {
  return (process.env.ALLOWED_CHANNEL_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: DEBUG ? LogLevel.DEBUG : LogLevel.INFO
});

// ---------- Assistant panel (private thread during a live session) ----------

const assistant = new Assistant({
  threadStarted: async ({ say, setSuggestedPrompts, logger }) => {
    try {
      await say({ blocks: buildWelcome(), text: "Hi, I'm Crisis Companion" });
      await setSuggestedPrompts({
        title: 'How can I support your shift?',
        prompts: [
          {
            title: 'Debrief a hard session',
            message: 'Debrief: caller was expressing hopelessness and talked about ending things. I froze near the end and I am not sure my closing helped.'
          },
          {
            title: 'Live panic support',
            message: 'Texter is having a panic attack right now, hyperventilating and terrified. What can I say?'
          },
          {
            title: 'DV referral (India)',
            message: 'Caller in India is afraid to go home, partner is violent and controlling. I need referral resources and safe phrasing.'
          }
        ]
      });
    } catch (err) {
      logger.error('threadStarted failed', err);
    }
  },

  threadContextChanged: async ({ saveThreadContext }) => {
    await saveThreadContext();
  },

  userMessage: async ({ client, message, say, setTitle, setStatus, logger }) => {
    if (message.subtype || message.bot_id) return;
    if (DEBUG) logger.info('[assistant userMessage payload]', JSON.stringify(message));
    try {
      await setStatus('consulting the vetted library and your team’s history…');
      const { blocks, text, classification } = await runPipeline({
        client,
        text: message.text,
        actionToken: extractActionToken(message),
        userId: message.user,
        sourceChannel: message.channel
      });
      await setTitle(classification.label);
      await say({ blocks, text });
    } catch (err) {
      logger.error('userMessage pipeline failed', err);
      await say('Something went wrong on my side. Your judgment is the real tool here — trust it, and lean on your supervisor if you need backup.');
    }
  }
});

app.assistant(assistant);

// ---------- DM flow: fallback for workspaces where the assistant panel UI isn't surfaced ----------

app.message(async ({ message, client, say, logger }) => {
  if (message.channel_type !== 'im') return;
  if (message.subtype || message.bot_id || message.thread_ts) return;
  if (DEBUG) logger.info('[dm message payload]', JSON.stringify(message));
  try {
    const { blocks, text } = await runPipeline({
      client,
      text: message.text,
      actionToken: extractActionToken(message),
      userId: message.user,
      sourceChannel: message.channel
    });
    await say({ blocks, text });
  } catch (err) {
    logger.error('dm pipeline failed', err);
    await say('Something went wrong on my side. Your judgment is the real tool here — trust it, and lean on your supervisor if you need backup.');
  }
});

// ---------- Channel flow: @mention in an approved debrief channel ----------

app.event('app_mention', async ({ event, client, say, logger }) => {
  if (DEBUG) logger.info('[app_mention payload]', JSON.stringify(event));
  const allow = allowedChannels();
  const threadTs = event.thread_ts ?? event.ts;

  if (allow.length && !allow.includes(event.channel)) {
    await say({
      thread_ts: threadTs,
      text: '🔒 I only operate in approved, anonymised channels. Ask your coordinator to add this channel to my allow-list.'
    });
    return;
  }

  try {
    const { blocks, text } = await runPipeline({
      client,
      text: event.text.replace(/<@[UW][A-Z0-9]+>/g, '').trim(),
      actionToken: extractActionToken(event),
      userId: event.user,
      sourceChannel: event.channel,
      sourceTs: event.ts
    });
    await say({ thread_ts: threadTs, blocks, text });
  } catch (err) {
    logger.error('app_mention pipeline failed', err);
    await say({
      thread_ts: threadTs,
      text: 'Something went wrong on my side. Your judgment is the real tool here — trust it, and lean on your supervisor if you need backup.'
    });
  }
});

registerHome(app);
registerActions(app);

// ---------- Start ----------

await app.start();
console.log('🕊️ Crisis Companion is running (Socket Mode)');
console.log(`   Allow-listed channels: ${allowedChannels().join(', ') || '(none set — set ALLOWED_CHANNEL_IDS in .env)'}`);
