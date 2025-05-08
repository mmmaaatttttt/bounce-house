import { DraggableObjectProps } from "../../types/interactive";

function Observer({
  x,
  y,
  id,
  onDragStart,
  isReflection = false,
}: DraggableObjectProps) {
  const reflection = isReflection ? "reflection" : "draggable-object";
  return (
    <circle
      r={10}
      cx={x}
      cy={y}
      className={`observer-circle draggable-object ${reflection}`}
      onMouseDown={e => {
        e.preventDefault();
        onDragStart?.(id);
      }}
    />
  );
}

export default Observer;
