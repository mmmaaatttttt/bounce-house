import useInteractiveStore from "../../store/useInteractiveStore";
import ViewableObject from "./ViewableObject";
import Observer from "./Observer";
import Mirror from "./Mirror";
import computeReflections from "../../utils/reflections";
import { SceneObject } from "../../types/interactive";

function ReflectionsLayer() {
  const { objects, activeMirrors, interactiveSize, setCurrentReflection } =
    useInteractiveStore();

  const reflections = computeReflections(
    objects,
    activeMirrors,
    interactiveSize,
  );

  const handleReflectionClick = (reflection: SceneObject) => {
    setCurrentReflection(reflection);
  };

  return (
    <>
      {reflections.map(ref => {
        const key = `${ref.type}-${ref.x}-${ref.y}-${ref.name}`;

        switch (ref.type) {
          case "viewableObject":
            return (
              <g key={key} onClick={() => handleReflectionClick(ref)}>
                <ViewableObject
                  id={ref.name ?? ""}
                  x={ref.x}
                  y={ref.y}
                  isReflection
                />
              </g>
            );
          case "observer":
            return (
              <Observer
                key={key}
                id={ref.name ?? ""}
                x={ref.x}
                y={ref.y}
                isReflection
              />
            );
          case "mirror":
            return (
              <Mirror
                key={key}
                x={ref.x}
                y={ref.y}
                length={ref.length}
                isVertical={ref.isVertical}
                isReflection
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export default ReflectionsLayer;
