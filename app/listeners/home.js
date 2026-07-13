import { getShift } from '../lib/stats.js';
import { CRISIS_TYPES } from '../lib/classifier.js';
import { listProtocols } from '../lib/mcp-client.js';

function effectiveness(shift) {
  const totals = Object.values(shift.feedback ?? {}).reduce(
    (acc, f) => ({ helped: acc.helped + f.helped, notHelped: acc.notHelped + f.notHelped }),
    { helped: 0, notHelped: 0 }
  );
  const rated = totals.helped + totals.notHelped;
  return rated ? `${Math.round((totals.helped / rated) * 100)}% helpful _(${rated} rated)_` : '_No feedback logged yet_';
}

export function registerHome(app) {
  app.event('app_home_opened', async ({ event, client, logger }) => {
    if (event.tab !== 'home') return;
    const shift = getShift(event.user);

    const byType = Object.entries(shift.byType)
      .map(([type, n]) => `${CRISIS_TYPES[type]?.emoji ?? '⬜'} ${CRISIS_TYPES[type]?.label ?? 'General distress'}: *${n}*`)
      .join('\n');

    try {
      await client.views.publish({
        user_id: event.user,
        view: {
          type: 'home',
          blocks: [
            { type: 'header', text: { type: 'plain_text', text: '🕊️ Your Shift Dashboard' } },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Sessions supported this shift:* ${shift.sessions}\n${byType || '_No sessions yet — I\'m here when you need me._'}`
              }
            },
            { type: 'divider' },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Effectiveness this shift:* ${effectiveness(shift)}\n*Escalations:* ${shift.escalations ?? 0}`
              }
            },
            { type: 'divider' },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Quick access*\n• `@Crisis Companion <debrief>` in an approved channel → phrasing + past cases + resources\n• DM me directly, or open my assistant panel (✨ icon), for a private thread during a live session'
              },
              accessory: {
                type: 'button',
                text: { type: 'plain_text', text: '📋 View all protocols', emoji: true },
                action_id: 'view_protocols'
              }
            },
            { type: 'divider' },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: '🔒 *Privacy:* session counts live in memory only and vanish on restart. Messages are never stored. Search runs only across allow-listed anonymised channels, after PII scrubbing.'
                }
              ]
            }
          ]
        }
      });
    } catch (err) {
      logger.error('home publish failed', err);
    }
  });

  app.action('view_protocols', async ({ ack, body, client, logger }) => {
    await ack();
    try {
      const protocols = (await listProtocols()) ?? [];
      const blocks = protocols.flatMap((p, i) => [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: `*${p.title}*\n${p.steps.map((s, j) => `${j + 1}. ${s}`).join('\n')}` }
        },
        ...(i < protocols.length - 1 ? [{ type: 'divider' }] : [])
      ]);

      await client.views.open({
        trigger_id: body.trigger_id,
        view: {
          type: 'modal',
          title: { type: 'plain_text', text: 'Quick protocols' },
          close: { type: 'plain_text', text: 'Close' },
          blocks: blocks.length ? blocks : [{ type: 'section', text: { type: 'mrkdwn', text: 'No protocols available.' } }]
        }
      });
    } catch (err) {
      logger.error('view_protocols modal failed', err);
    }
  });
}
