// Seeds #debriefs-anon with synthetic, fully anonymised sample debriefs so the
// Real-time Search API has an institutional-memory corpus to search.
// Usage: npm run seed

import 'dotenv/config';
import { WebClient } from '@slack/web-api';

const DEBRIEFS = [
  'Debrief: caller in their 40s, recent job loss, expressing hopelessness and passive suicidal thoughts, no plan or timeline. What worked: asking directly about suicide — they said no one had ever asked them plainly before. Ended with them agreeing to call the KIRAN helpline in the morning and to stay with their sister tonight.',
  'Debrief: young texter with active suicidal ideation, mentioned having pills in the room. What worked: calmly asking if they would be willing to put the pills in another room while we talked. They did. We stayed on small next steps — water, a blanket, one text to a friend. Warm handoff to supervisor for follow-up.',
  'Debrief: caller talking about ending things after a breakup, said they had written a goodbye note. Escalated per protocol after assessing plan and means. What worked before escalation: reflecting their pain without minimising, and saying "we only need to get through tonight, together."',
  'Debrief: texter disclosed cutting again after six months clean. What worked: thanking them for the honesty first, then asking what the cutting helps them get through. No injuries needing medical care. They tried the ice-cube technique during the chat and said the wave passed.',
  'Debrief: caller self-harming with burning, very ashamed, almost hung up twice. What worked: explicitly saying "I am not here to judge you" early, and letting silences sit. They stayed 40 minutes and accepted a follow-up resource.',
  'Debrief: caller whispering, partner violent, afraid to go home tonight. What worked: agreeing on short yes/no answers and a stop word in case the partner returned. Did NOT push her to leave. Built a mini safety plan: documents photographed, one bag at a friend\'s place, code word with her sister. Shared the 181 women helpline number.',
  'Debrief: DV situation, caller blamed herself repeatedly. What worked: saying "I believe you, and this is not your fault" — she cried and said it was the first time anyone said that. Kept the focus on her safety and her own timeline, not on decisions.',
  'Debrief: caller drank heavily and took "a few extra" sleeping pills, unsure how many. Treated as possible overdose, escalated to emergency protocol immediately. Learning: ask the overdose screening questions (what, how much, when, mixed with what) before anything else when substances come up.',
  'Debrief: texter relapsed after 8 months sober, spiralling with shame. What worked: "a relapse doesn\'t erase the progress you made — it\'s one moment in a longer story." Identified their sponsor as the person to be with tonight; they texted them during our chat.',
  'Debrief: caller mid panic attack, hyperventilating, convinced they were dying. What worked: short slow messages, long-exhale breathing together, then 5-4-3-2-1 grounding. The peak passed in about 10 minutes. Note for the team: typing slower genuinely changes the caller\'s pace.',
  'Debrief: student panicking before results day, chest tight, couldn\'t stop shaking. What worked: naming that panic peaks and falls, and that we only needed to get through the next few minutes. Grounded with five things they could see. Ended calm, agreed on a plan for the morning.',
  'Debrief: caller lost her husband two months ago, said the house is unbearable at night. What worked: asking "would you like to tell me about him?" — she talked for 20 minutes and thanked me. No hopelessness signals. Gentle screen for suicidal thoughts was clear.',
  'Debrief: caller grieving a miscarriage, felt she wasn\'t "allowed" to grieve. What worked: normalising — there is no timetable and no permission needed. Flagged for the team: several grief calls this month mention anniversaries; watch for seasonal patterns.',
  'Debrief: caller vague and exhausted, "can\'t take it anymore" but no specific crisis surfaced for a while. What worked: open questions and staying patient — the core concern (carer burnout) surfaced at minute 15. Reminder that "can\'t take it" needs a gentle direct screen for suicidal thoughts; theirs was negative.'
];

const HEADER =
  ':lock: *About this channel:* anonymised volunteer debriefs only — no names, no contact details, no identifying details. The messages below are *synthetic sample debriefs* seeded for demo purposes. Crisis Companion searches ONLY this allow-listed channel.';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token || !token.startsWith('xoxb-')) {
    console.error('Set SLACK_BOT_TOKEN in .env first (see SETUP.md).');
    process.exit(1);
  }
  const client = new WebClient(token);

  let channel = (process.env.ALLOWED_CHANNEL_IDS ?? '').split(',')[0]?.trim();
  if (!channel) {
    const list = await client.conversations.list({ types: 'public_channel', limit: 200 });
    channel = list.channels.find((c) => c.name === 'debriefs-anon')?.id;
  }
  if (!channel) {
    console.error('No channel found. Set ALLOWED_CHANNEL_IDS in .env or create #debriefs-anon.');
    process.exit(1);
  }

  try {
    await client.conversations.join({ channel });
  } catch (err) {
    console.warn('conversations.join:', err?.data?.error ?? err.message);
  }

  console.log(`Seeding ${DEBRIEFS.length} synthetic debriefs into ${channel}…`);
  await client.chat.postMessage({ channel, text: HEADER });
  await sleep(1100);

  for (const [i, text] of DEBRIEFS.entries()) {
    await client.chat.postMessage({ channel, text });
    console.log(`  ${i + 1}/${DEBRIEFS.length}`);
    await sleep(1100);
  }

  console.log('Done. Give Slack search a few minutes to index before demoing.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
