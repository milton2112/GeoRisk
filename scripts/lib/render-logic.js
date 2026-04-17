export function clampQualityScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

export function shouldThrottleHover({ isMobile = false, is2d = false, isNavigating = false, lowFps = false } = {}) {
  return Boolean(isMobile || is2d || isNavigating || lowFps);
}
