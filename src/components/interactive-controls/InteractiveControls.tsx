import ReflectionToggle from "./ReflectionToggle";
import MirrorToggle from "./MirrorToggle";

function InteractiveControls() {
  return (
    <div className="hud-container">
      <div className="hud-controls-row">
        <ReflectionToggle />
        <MirrorToggle />
      </div>
    </div>
  );
}

export default InteractiveControls;
