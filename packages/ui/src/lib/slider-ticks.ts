/**
 * Pure tick + percentage math for the slider family.
 * Kept dependency-free so it can be unit-tested without React.
 */

export function getTickPcts(tickCount: number): number[] {
  if (tickCount <= 0) return [];
  return Array.from({ length: tickCount }, (_, i) => ((i + 1) / (tickCount + 1)) * 100);
}

export function getTickValues(
  min: number,
  max: number,
  tickCount: number
): number[] {
  return getTickPcts(tickCount).map((pct) => min + (pct / 100) * (max - min));
}

export function snapToNearestTick(
  value: number,
  tickValues: number[],
  min: number,
  max: number,
  tickCount: number
): number {
  if (tickValues.length === 0) return value;
  const range = max - min;
  const threshold = (range / (tickCount + 1)) * 0.55;
  let snapped = value;
  let nearestDist = threshold;
  for (const tick of tickValues) {
    const dist = Math.abs(value - tick);
    if (dist < nearestDist) {
      nearestDist = dist;
      snapped = tick;
    }
  }
  return snapped;
}

export function valueToPct(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}
