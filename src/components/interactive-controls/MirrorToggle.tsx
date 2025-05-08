import useInteractiveStore from "../../store/useInteractiveStore";

function MirrorToggle() {
  const { activeMirrors, toggleMirror, objects } = useInteractiveStore();
  const mirrors = Object.entries(objects)
    .map(([id, obj]) => ({ ...obj, id }))
    .filter(obj => obj.type === "mirror");

  if (mirrors.length === 0) return null;

  return (
    <div className="mirrors-control">
      {mirrors.map(mirror => {
        const { id, name } = mirror;
        const isActive = activeMirrors.has(id);
        const displayName = name || "Mirror";

        return (
          <button
            key={id}
            className={`toggle-btn ${isActive ? "active" : ""}`}
            onClick={() => toggleMirror(id)}
          >
            <span className="toggle-icon">{isActive ? "✓" : "×"}</span>
            <span>{displayName}</span>
          </button>
        );
      })}
    </div>
  );
}

export default MirrorToggle;
