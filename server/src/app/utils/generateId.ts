export function generateId(ids: number[]): number {
  const usedIds = new Set(ids);
  let candidateId = 0;

  while (usedIds.has(candidateId)) {
    candidateId++;
  }

  return candidateId;
}
