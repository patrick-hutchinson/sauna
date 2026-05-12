export function updateMorphTargets(morphTargets, elapsedSeconds, secondsPerMorph = 8) {
  if (morphTargets.length === 0) return;

  const time = elapsedSeconds / secondsPerMorph;
  const phase = Math.floor(time);
  const t = time - phase;
  const eased = t * t * (3 - 2 * t);

  for (const target of morphTargets) {
    const {indices, influences} = target;
    const from = phase % indices.length;
    const to = (from + 1) % indices.length;

    influences.fill(0);
    influences[indices[from]] = 1 - eased;
    influences[indices[to]] = eased;
  }
}
