import type { StagePanelItem } from "@/types/stage";
import StagePanel from "./StagePanel";
import StageTrack from "./StageTrack";

interface StageProps {
  panels: StagePanelItem[];
}

// Server component: panels arrive pre-rendered, so only the track and
// the panel wrappers ship as client code. The viewport attribute scopes
// swipes to the stage; pan-y leaves vertical scrolling to the browser.
// isolate keeps the active panel's z-index inside the stage.
const Stage = ({ panels }: StageProps) => (
  <div
    data-stage-viewport
    className="isolate h-full touch-pan-y overflow-hidden"
  >
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
