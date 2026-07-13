// Block Kit builders. Tone: calm, low-stimulus, scannable under pressure.

const DISCLAIMER =
  'Crisis Companion supports your judgment — it never replaces it. Phrases come from a vetted library; resources from a curated database. Nothing you type is stored.';

const INTENSITY = {
  high: { label: 'time-critical', emoji: '🔴' },
  elevated: { label: 'elevated', emoji: '🟠' },
  standard: { label: 'standard', emoji: '🟢' }
};

export function buildSupportReply({ classification, phrases, protocol, helplines, similarCases, redactions, searchNote, autoEscalated }) {
  const intensity = INTENSITY[classification.intensity] ?? INTENSITY.standard;
  const blocks = [];

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${classification.emoji} *${classification.label}*  ·  ${intensity.emoji} ${intensity.label}`
    }
  });

  if (autoEscalated) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ":rotating_light: *Supervisor notified automatically* — this looked time-critical, so I've already alerted crisis-resources. No need to click Escalate too, but you still can for direct confirmation."
      }
    });
  }

  if (classification.intensity === 'high' && phrases?.safety_note) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `:rotating_light: *Safety first:* ${phrases.safety_note}` }
    });
  }

  if (phrases?.phrases?.length) {
    const top = phrases.phrases.slice(0, 3).map((p) => `• ${p}`).join('\n');
    blocks.push({ type: 'divider' });
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*💬 Suggested phrasing* _(vetted library)_\n${top}` }
    });
    if (classification.intensity !== 'high' && phrases.safety_note) {
      blocks.push({
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `*Note:* ${phrases.safety_note}` }]
      });
    }
  }

  blocks.push({ type: 'divider' });
  if (similarCases?.length) {
    const cases = similarCases
      .map((c) => `• <${c.permalink}|${c.title}> — _${c.snippet}_`)
      .join('\n');
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*📚 Similar past cases* _(from your team's anonymised debriefs)_\n${cases}`
      }
    });
  } else {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `📚 ${searchNote ?? 'No similar past cases found in the allowed channels.'}` }]
    });
  }

  if (helplines?.length) {
    blocks.push({ type: 'divider' });
    const lines = helplines
      .slice(0, 4)
      .map((h) => `• *${h.name}*: ${h.contact}${h.hours ? `  _(${h.hours})_` : ''}`)
      .join('\n');
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*☎️ Referral resources* _(via MCP · curated database)_\n${lines}` }
    });
  }

  if (protocol?.steps?.length) {
    blocks.push({ type: 'divider' });
    const steps = protocol.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*🧭 Protocol: ${protocol.title}*\n${steps}` }
    });
  }

  blocks.push({ type: 'divider' });
  blocks.push({
    type: 'actions',
    block_id: 'cc_feedback',
    elements: [
      {
        type: 'button',
        text: { type: 'plain_text', text: '✅ Helped', emoji: true },
        style: 'primary',
        action_id: 'feedback_helped',
        value: classification.type
      },
      {
        type: 'button',
        text: { type: 'plain_text', text: "❌ Didn't land", emoji: true },
        action_id: 'feedback_not_helped',
        value: classification.type
      },
      {
        type: 'button',
        text: { type: 'plain_text', text: '🚨 Escalate to supervisor', emoji: true },
        style: 'danger',
        action_id: 'escalate',
        value: JSON.stringify({ type: classification.type, intensity: classification.intensity, label: classification.label })
      }
    ]
  });

  const privacyBits = [];
  if (redactions?.length) privacyBits.push(`PII scrubbed before search (${redactions.length} redaction${redactions.length > 1 ? 's' : ''})`);
  privacyBits.push('search limited to allow-listed channels');
  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: `🔒 ${privacyBits.join(' · ')}\n${DISCLAIMER}` }]
  });

  return blocks;
}

export function buildWelcome() {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: "Hi, I'm *Crisis Companion* 🕊️\nDebrief a session or describe what's happening on your line, and I'll surface suggested phrasing, similar past cases from your team's history, and referral resources.\n\nEverything stays in this thread. PII is scrubbed before anything is searched, and nothing is stored."
      }
    }
  ];
}
