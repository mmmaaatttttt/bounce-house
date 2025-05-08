import useInteractiveStore from "../../store/useInteractiveStore";

function ReflectionToggle() {
  const { showReflections, toggleReflections } = useInteractiveStore();

  return (
    <div className="control-item">
      <button
        onClick={toggleReflections}
        className={`toggle-btn ${showReflections ? "active" : ""}`}
      >
        <span className="toggle-icon">{showReflections ? "✓" : "×"}</span>
        <span>Reflections</span>
      </button>

      {showReflections && (
        <div className="tooltip">Click a reflection to view its light path</div>
      )}
    </div>
  );
}

export default ReflectionToggle;
