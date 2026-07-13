// In-memory, per-volunteer shift stats for the Home tab. Deliberately
// ephemeral: nothing about sessions is ever written to disk.

const shifts = new Map();

function emptyShift() {
  return { sessions: 0, byType: {}, feedback: {}, escalations: 0, since: Date.now() };
}

function shiftFor(userId) {
  const s = shifts.get(userId) ?? emptyShift();
  shifts.set(userId, s);
  return s;
}

export function recordSession(userId, crisisType) {
  if (!userId) return;
  const s = shiftFor(userId);
  s.sessions += 1;
  s.byType[crisisType] = (s.byType[crisisType] ?? 0) + 1;
}

/** Records a volunteer's verdict on whether a suggested phrasing set helped. */
export function recordFeedback(userId, crisisType, helped) {
  if (!userId) return;
  const s = shiftFor(userId);
  const f = s.feedback[crisisType] ?? { helped: 0, notHelped: 0 };
  if (helped) f.helped += 1; else f.notHelped += 1;
  s.feedback[crisisType] = f;
}

export function recordEscalation(userId) {
  if (!userId) return;
  shiftFor(userId).escalations += 1;
}

export function getShift(userId) {
  return shifts.get(userId) ?? emptyShift();
}
