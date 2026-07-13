// Wrapper around Slack's Real-time Search API (assistant.search.context).
// Enforces the channel allow-list on results: even if the API returns matches
// from elsewhere, only allow-listed channels ever reach the volunteer.

function allowedChannelIds() {
  return (process.env.ALLOWED_CHANNEL_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function channelIdOf(msg) {
  return msg?.channel?.id ?? msg?.channel_id ?? msg?.channel ?? null;
}

// Slack mrkdwn entities (<@U123|name>, <#C123|name>, <url|label>) read as raw
// noise in a plain-text snippet — render them the way a human would say them.
function stripSlackMarkup(text) {
  return text
    .replace(/<@[UW][A-Z0-9]+\|([^>]+)>/g, '@$1')
    .replace(/<@[UW][A-Z0-9]+>/g, '@teammate')
    .replace(/<#[CG][A-Z0-9]+\|([^>]+)>/g, '#$1')
    .replace(/<(https?:\/\/[^|>]+)\|([^>]+)>/g, '$2')
    .replace(/<(https?:\/\/[^>]+)>/g, '$1');
}

/**
 * Search anonymised debrief history for similar past cases.
 * Requires an action_token (present in app_mention and assistant-thread
 * message events when using a bot token).
 *
 * Returns { available, cases: [{title, snippet, permalink}], note }
 */
export async function findSimilarCases(client, { query, actionToken, limit = 3 }) {
  if (!actionToken) {
    return {
      available: false,
      cases: [],
      note: 'Institutional memory needs an @mention or assistant thread (no action token on this event).'
    };
  }

  try {
    const resp = await client.apiCall('assistant.search.context', {
      query,
      action_token: actionToken,
      channel_types: 'public_channel',
      content_types: 'messages',
      limit: 20
    });

    const messages = resp?.results?.messages ?? resp?.messages ?? [];
    const allowList = allowedChannelIds();
    const cases = messages
      .filter((m) => allowList.length === 0 || allowList.includes(channelIdOf(m)))
      .filter((m) => m?.permalink && (m?.content || m?.text))
      .slice(0, limit)
      .map((m, i) => {
        const raw = stripSlackMarkup(m.content ?? m.text ?? '').replace(/\s+/g, ' ').trim();
        return {
          title: `Past case ${i + 1}`,
          snippet: raw.length > 160 ? `${raw.slice(0, 157)}…` : raw,
          permalink: m.permalink
        };
      });

    return { available: true, cases, note: cases.length ? null : 'No similar past cases found in the allowed channels.' };
  } catch (err) {
    const code = err?.data?.error ?? err.message;
    console.error('[search] assistant.search.context failed:', code);
    return { available: false, cases: [], note: `Institutional memory temporarily unavailable (${code}).` };
  }
}
