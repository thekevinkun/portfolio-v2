interface PlaceholderPanelProps {
  id: string;
  label: string;
}

// Temporary content; real pages replace this in P3
const PlaceholderPanel = ({ id, label }: PlaceholderPanelProps) => (
  <div className="flex h-full flex-col items-center justify-center gap-2">
    <h2 id={`heading-${id}`} className="text-2xl font-bold">
      {label}
    </h2>
    <p className="font-mono text-xs text-fg-low">Placeholder panel</p>
  </div>
);

export default PlaceholderPanel;
