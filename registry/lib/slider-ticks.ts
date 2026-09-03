/** Tick mark positions as 0–100 percentages along the track. */
export function getTickPcts(tickCount: number): number[] {
  if (tickCount <= 0) return [];
  return Array.from({ length: tickCount }, (_, i) => ((i + 1) / (tickCount + 1)) * 100);
}

/** Tick values in slider number space. */
export function getTickValues(min: number, max: number, tickCount: number): number[] {
  return getTickPcts(tickCount).map((pct) => min + (pct / 100) * (max - min));
}

/** Soft magnetic snap to nearest tick when within threshold. */
export function snapToNearestTick(
  value: number,
  tickValues: number[],
  min: number,
  max: number,
  tickCount: number,
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
