import { DraggableObjectProps } from "../../types/interactive";

function ViewableObject({ x, y, id, onDragStart, isReflection = false }: DraggableObjectProps) {
  const reflection = isReflection ? "reflection" : "draggable-object"
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseDown={e => {
        e.preventDefault();
        onDragStart?.(id);
      }}
      className="draggable-object"
    >
      <polygon points="0,-10 10,10 -10,10" className={`object-triangle ${reflection}`} />
    </g>
  );
}

export default ViewableObject;
