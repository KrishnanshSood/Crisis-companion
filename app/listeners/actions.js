// Reply-card interactivity: effectiveness feedback and live supervisor escalation.
// Both close the loop the ambient-guidance pipeline otherwise leaves open —
// feedback calibrates what "helped" means over a shift, escalation turns a
// suggestion into an actual human handoff.

import { recordFeedback, recordEscalation } from '../lib/stats.js';
import { postEscalationAlert } from '../lib/escalation.js';

async function replaceFeedbackBlock(client, body, note) {
  const blocks = (body.message?.blocks ?? []).filter((b) => b.block_id !== 'cc_feedback');
  blocks.push({ type: 'context', block_id: 'cc_feedback', elements: [{ type: 'mrkdwn', text: note }] });
  await client.chat.update({ channel: body.channel.id, ts: body.message.ts, blocks, text: body.message.text });
}

export function registerActions(app) {
  app.action('feedback_helped', async ({ ack, body, client, logger }) => {
    await ack();
    recordFeedback(body.user.id, body.actions[0].value, true);
    try {
      await replaceFeedbackBlock(client, body, '✅ Marked as helpful — thank you.');
    } catch (err) {
      logger.error('feedback_helped update failed', err);
    }
  });

  app.action('feedback_not_helped', async ({ ack, body, client, logger }) => {
    await ack();
    recordFeedback(body.user.id, body.actions[0].value, false);
    try {
      await replaceFeedbackBlock(client, body, "📝 Noted — thanks, it helps calibrate the library.");
    } catch (err) {
      logger.error('feedback_not_helped update failed', err);
    }
  });

  app.action('escalate', async ({ ack, body, client, logger }) => {
    await ack();
    recordEscalation(body.user.id);
    const info = JSON.parse(body.actions[0].value ?? '{}');

    try {
      const { permalink } = await client.chat.getPermalink({ channel: body.channel.id, message_ts: body.message.ts });
      const posted = await postEscalationAlert(client, {
        label: info.label,
        intensity: info.intensity,
        context: `<@${body.user.id}> needs a supervisor now.`,
        joinUrl: permalink
      });
      if (!posted) logger.error('escalate fired with no ESCALATION_CHANNEL_ID or ALLOWED_CHANNEL_IDS configured');
    } catch (err) {
      logger.error('escalation post failed', err);
    }

    try {
      await replaceFeedbackBlock(client, body, '🚨 Escalated — a supervisor has been notified in the crisis-resources channel.');
    } catch (err) {
      logger.error('escalate update failed', err);
    }
  });
}
