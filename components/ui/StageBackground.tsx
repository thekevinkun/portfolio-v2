// Three fixed, non-interactive layers behind all pages: gradient, glow, grain.
const StageBackground = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-stage-base" />
      <div className="absolute inset-0 bg-stage-glow" />
      <div className="absolute inset-0 bg-grain opacity-5" />
    </div>
  );
};

export default StageBackground;
