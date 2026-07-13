// Shared logic for posting a live alert into the supervisor/shift-lead
// channel. Used both by the manual "Escalate to supervisor" button and by
// automatic escalation when the classifier flags a time-critical situation.

export function escalationChannel() {
  return process.env.ESCALATION_CHANNEL_ID || (process.env.ALLOWED_CHANNEL_IDS ?? '').split(',')[0]?.trim() || null;
}

/** Returns true if an alert was posted (i.e. a channel was configured). */
export async function postEscalationAlert(client, { label, intensity, context, joinUrl }) {
  const channel = escalationChannel();
  if (!channel) return false;

  const header = `🚨 *${label ?? 'Crisis'}* · ${intensity ?? 'standard'} intensity\n${context}`;
  await client.chat.postMessage({
    channel,
    text: `🚨 Escalation — ${label ?? 'crisis'} (${intensity ?? 'standard'} intensity). ${context}`,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: header } },
      ...(joinUrl
        ? [{ type: 'actions', elements: [{ type: 'button', text: { type: 'plain_text', text: 'Join thread' }, url: joinUrl, style: 'primary' }] }]
        : [])
    ]
  });
  return true;
}
