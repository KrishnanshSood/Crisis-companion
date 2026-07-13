// The core pipeline, in strict order:
//   scrub (PII never leaves the thread) → classify (deterministic lexicon)
//   → in parallel: real-time search over allow-listed history,
//                  MCP helpline lookup, MCP protocol lookup
//   → one calm Block Kit reply.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classify } from './classifier.js';
import { scrub } from './scrub.js';
import { findSimilarCases } from './search.js';
import { findHelplines, getProtocol } from './mcp-client.js';
import { recordSession } from './stats.js';
import { buildSupportReply } from '../blocks/response.js';

const PHRASES = JSON.parse(
  readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'phrases.json'), 'utf8')
);

const COUNTRIES = [
  [/\bindia\b/i, 'IN'],
  [/\b(?:usa|u\.s\.|united states|america)\b/i, 'US'],
  [/\b(?:uk|united kingdom|britain|england|scotland|wales)\b/i, 'GB'],
  [/\baustralia\b/i, 'AU'],
  [/\bcanada\b/i, 'CA'],
  [/\bnew zealand\b/i, 'NZ'],
  [/\bireland\b/i, 'IE'],
  [/\bsouth africa\b/i, 'ZA']
];

function detectCountry(text) {
  for (const [re, code] of COUNTRIES) {
    if (re.test(text)) return code;
  }
  return null;
}

export function extractActionToken(event) {
  return event?.assistant_thread?.action_token ?? event?.action_token ?? null;
}

export async function runPipeline({ client, text, actionToken, userId }) {
  const { scrubbed, redactions } = scrub(text ?? '');
  const classification = classify(scrubbed);
  const country = detectCountry(scrubbed) ?? process.env.DEFAULT_COUNTRY ?? 'IN';

  const query = `${classification.label} debrief: ${scrubbed.slice(0, 250)}`;
  const [search, helplines, protocol] = await Promise.all([
    findSimilarCases(client, { query, actionToken }),
    findHelplines({ country, crisisType: classification.type }),
    getProtocol({ crisisType: classification.type })
  ]);

  recordSession(userId, classification.type);

  const blocks = buildSupportReply({
    classification,
    phrases: PHRASES[classification.type] ?? PHRASES.general_distress,
    protocol,
    helplines,
    similarCases: search.cases,
    redactions,
    searchNote: search.note
  });

  return {
    blocks,
    text: `${classification.label} — suggested phrasing, similar past cases, and resources`,
    classification
  };
}
