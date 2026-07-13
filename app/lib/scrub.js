// PII scrubber. Runs on every message BEFORE any text is used in a search
// query or sent to the MCP server. Conservative by design: better to
// over-redact a search query than leak an identifier.

const RULES = [
  { name: 'slack_mention', re: /<@[UW][A-Z0-9]+>/g, sub: '[person]' },
  { name: 'email', re: /[\w.+-]+@[\w-]+\.[\w.-]+/g, sub: '[email]' },
  // Phone numbers / long numeric IDs: 7+ digits in any grouping with common
  // separators, optional leading +. Deliberately broad — over-redacting a
  // search query is acceptable, leaking a number is not.
  { name: 'phone', re: /\+?\d(?:[\s.()-]?\d){6,14}/g, sub: '[phone]' },
  { name: 'url', re: /https?:\/\/\S+/g, sub: '[link]' },
  // "my name is Priya", "caller named Rahul", "client called Anna Maria"
  { name: 'stated_name', re: /\b(?:name\s+is|named|calls?\s+(?:himself|herself|themselves)|goes\s+by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g, sub: (m) => m.replace(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)$/, '[name]') },
  // Honorific + capitalized name: Mr. Sharma, Dr Rao, Mrs. Smith
  { name: 'honorific_name', re: /\b(?:Mr|Mrs|Ms|Dr|Prof)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g, sub: '[name]' },
  // Ages: "34 years old", "aged 34", "34 y/o", "34yo"
  { name: 'age', re: /\b(?:aged?\s+\d{1,2}|\d{1,2}\s*(?:years?\s+old|y\/?o\b|yrs?\s+old))/gi, sub: '[age]' },
  // Long digit runs (IDs, case numbers) not already caught.
  { name: 'id_number', re: /\b\d{6,}\b/g, sub: '[number]' }
];

/**
 * Scrub PII from text. Returns { scrubbed, redactions } where redactions is a
 * list of rule names that fired (never the redacted values themselves).
 */
export function scrub(text) {
  let scrubbed = text;
  const redactions = [];
  for (const rule of RULES) {
    const before = scrubbed;
    scrubbed = scrubbed.replace(rule.re, rule.sub);
    if (scrubbed !== before) redactions.push(rule.name);
  }
  return { scrubbed, redactions };
}
