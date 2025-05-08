import { useRef, useEffect } from "react";
import useInteractiveStore from "../../store/useInteractiveStore";
import GridPoints from "./GridPoints";
import ViewableObject from "./ViewableObject";
import Observer from "./Observer";
import Mirror from "./Mirror";
import ReflectionsLayer from "./ReflectionsLayer";
import categorizeMirrors from "../../utils/categorize-mirrors";
import LightAnimations from "./LightAnimations";
import { MirrorObject } from "../../types/interactive";

function InteractiveBase() {
  const {
    interactiveSize,
    gridSize,
    objects,
    dragging,
    selectedObject,
    hideGrid,
    startDragging,
    stopDragging,
    moveObject,
    activeMirrors,
    showReflections,
    resetPosition,
  } = useInteractiveStore();
  const { left, right, top } = categorizeMirrors(objects, activeMirrors);

  useEffect(() => {
    for (const [id, obj] of Object.entries(objects)) {
      if (obj.type === "mirror") continue;

      const outsideRightBounds = right && obj.x >= right.x;
      const outsideLeftBounds = left && obj.x <= left.x;
      const outsideTopBounds = top && obj.y <= top.y;

      if (outsideLeftBounds || outsideRightBounds || outsideTopBounds) {
        resetPosition(id);
      }
    }
  }, [left, right, top, objects, resetPosition]);

  const svgRef = useRef<SVGSVGElement>(null);

  const handleDragStart = (objectId: string) => {
    startDragging(objectId);
  };

  const handleDrag = (event: React.MouseEvent, objectId: string) => {
    if (!dragging) return;

    const svg = svgRef.current;
    if (!svg) return;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const svgPoint = point.matrixTransform(ctm.inverse());

    let snappedX = Math.round(svgPoint.x / gridSize) * gridSize;
    let snappedY = Math.round(svgPoint.y / gridSize) * gridSize;

    if (left) {
      snappedX = Math.max(snappedX, left.x + gridSize);
    }

    if (right) {
      snappedX = Math.min(snappedX, right.x - gridSize);
    }

    if (top) {
      snappedY = Math.max(snappedY, top.y + gridSize);
    }

    moveObject(objectId, { x: snappedX, y: snappedY });
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      hideGrid();
    }, 200);
    stopDragging();
  };

  const mirrors = Object.entries(objects).filter(
    entry => entry[1].type === "mirror",
  );
  const nonMirrors = Object.entries(objects).filter(
    entry => entry[1].type !== "mirror",
  );

  return (
    <div className="interactive-container">
      <svg
        ref={svgRef}
        width={interactiveSize.width}
        height={interactiveSize.height}
        className="svg-canvas"
        onMouseMove={e => {
          if (dragging) {
            handleDrag(e, selectedObject as string);
          }
        }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <GridPoints />
        {showReflections && <ReflectionsLayer />}

        {nonMirrors.map(([id, obj]) => {
          switch (obj.type) {
            case "viewableObject":
              return (
                <ViewableObject
                  key={id}
                  id={id}
                  x={obj.x}
                  y={obj.y}
                  onDragStart={handleDragStart}
                />
              );
            default:
              return (
                <Observer
                  key={id}
                  id={id}
                  x={obj.x}
                  y={obj.y}
                  onDragStart={handleDragStart}
                />
              );
          }
        })}
        <LightAnimations />
        {mirrors.map(([id, obj]) =>
          activeMirrors.has(id) ? (
            <Mirror
              key={id}
              x={obj.x}
              y={obj.y}
              length={(obj as MirrorObject).length}
              isVertical={(obj as MirrorObject).isVertical}
            />
          ) : null,
        )}
      </svg>
    </div>
  );
}

export default InteractiveBase;
