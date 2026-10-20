// Three fixed, non-interactive layers behind all pages: gradient, glow, grain.
// The glow drifts slowly (transform only). It is 8% larger than the screen on
// every side, so the drift (at most about 5.5%) never shows an edge.
const StageBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-stage-base" />
      <div className="absolute -inset-[8%] bg-stage-glow will-change-transform motion-safe:animate-ambient" />
      <div className="absolute inset-0 bg-grain opacity-5" />
    </div>
  );
};

export default StageBackground;
