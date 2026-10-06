import { StagePanel, StageTrack } from "@/components/stage";
import type { StagePanelItem } from "@/types/stage";

interface StageProps {
  panels: StagePanelItem[];
}

// Server component: panels arrive pre-rendered, so only the track and
// the panel wrappers ship as client code.
const Stage = ({ panels }: StageProps) => (
  <div className="h-full overflow-hidden">
    <StageTrack>
      {panels.map((panel, i) => (
        <StagePanel key={panel.id} id={panel.id} index={i}>
          {panel.content}
        </StagePanel>
      ))}
    </StageTrack>
  </div>
);

export default Stage;
