// Deterministic crisis classifier. No generative AI in the loop: every
// classification is traceable to an explicit lexicon match, which is a safety
// property in this domain, not a limitation.

const TYPES = {
  suicidal_ideation: {
    label: 'Suicidal ideation',
    emoji: '🟥',
    keywords: [
      'suicide', 'suicidal', 'kill myself', 'kill themselves', 'end my life',
      'end their life', 'ending things', 'end it all', 'ending it', 'not want to live',
      "doesn't want to live", 'want to die', 'wants to die', 'better off dead',
      'no reason to live', 'goodbye letter', 'final goodbye', 'take my own life',
      'take their own life', 'hopeless', 'hopelessness', 'no way out'
    ]
  },
  self_harm: {
    label: 'Self-harm',
    emoji: '🟧',
    keywords: [
      'self-harm', 'self harm', 'cutting', 'cut themselves', 'cut myself',
      'hurting myself', 'hurting themselves', 'hurt themselves', 'burning myself',
      'scratching until', 'punish myself', 'punish themselves'
    ]
  },
  domestic_violence: {
    label: 'Domestic violence / abuse',
    emoji: '🟪',
    keywords: [
      'domestic violence', 'abusive', 'abuse', 'abuser', 'hit me', 'hits me',
      'hits her', 'hits him', 'partner threatens', 'afraid to go home',
      'scared of my partner', 'scared of her partner', 'scared of his partner',
      'controlling partner', 'violent at home', 'unsafe at home', 'won’t let me leave',
      'wont let me leave', 'stalking', 'restraining order'
    ]
  },
  substance_use: {
    label: 'Substance use',
    emoji: '🟫',
    keywords: [
      'overdose', 'overdosing', 'relapse', 'relapsed', 'drinking again',
      'drunk', 'high right now', 'using again', 'withdrawal', 'detox',
      'pills and alcohol', 'substance', 'addiction', 'addicted'
    ]
  },
  panic_anxiety: {
    label: 'Panic / acute anxiety',
    emoji: '🟨',
    keywords: [
      'panic attack', 'panicking', 'hyperventilating', 'can’t breathe',
      'cant breathe', 'heart racing', 'shaking', 'terrified', 'anxiety attack',
      'spiraling', 'spiralling', 'losing control', 'chest tight'
    ]
  },
  grief_loss: {
    label: 'Grief / loss',
    emoji: '🟦',
    keywords: [
      'grief', 'grieving', 'passed away', 'died', 'death of', 'lost my',
      'lost her', 'lost his', 'lost their', 'funeral', 'anniversary of',
      'miscarriage', 'widow', 'bereaved', 'bereavement'
    ]
  }
};

// Signals that the situation is time-critical regardless of type.
const IMMINENCE = [
  'right now', 'tonight', 'today', 'has a plan', 'have a plan', 'has the means',
  'pills in hand', 'on the ledge', 'on a bridge', 'wrote a note', 'saying goodbye',
  'already took', 'just took', 'weapon', 'gun', 'knife', 'immediate danger',
  'in danger now', 'timeline', 'set a date'
];

const ELEVATION = [
  'getting worse', 'escalating', 'every day', 'can’t take it', 'cant take it',
  'breaking point', 'desperate', 'alone', 'no one', 'nobody', 'exhausted',
  'shutting down', 'stopped responding', 'went quiet', 'not answering'
];

function findMatches(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter((k) => lower.includes(k));
}

/**
 * Classify a debrief/message. Returns:
 * { type, label, emoji, intensity: 'high'|'elevated'|'standard', matched: string[] }
 * Falls back to general_distress when nothing matches.
 */
export function classify(text) {
  let best = null;
  for (const [type, def] of Object.entries(TYPES)) {
    const matched = findMatches(text, def.keywords);
    if (matched.length > 0 && (!best || matched.length > best.matched.length)) {
      best = { type, label: def.label, emoji: def.emoji, matched };
    }
  }
  if (!best) {
    best = { type: 'general_distress', label: 'General distress', emoji: '⬜', matched: [] };
  }

  const imminent = findMatches(text, IMMINENCE);
  const elevated = findMatches(text, ELEVATION);
  best.intensity = imminent.length > 0 ? 'high' : elevated.length > 0 ? 'elevated' : 'standard';
  best.matched = [...best.matched, ...imminent, ...elevated];
  return best;
}

export const CRISIS_TYPES = Object.fromEntries(
  Object.entries(TYPES).map(([k, v]) => [k, { label: v.label, emoji: v.emoji }])
);
