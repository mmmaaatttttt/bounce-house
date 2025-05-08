import useInteractiveStore from "../../store/useInteractiveStore";
import traceRayToObject from "../../utils/trace-ray-to-object";
import { MirrorObject, Point } from "../../types/interactive";
import LightRayPath from "./LightRayPath";
import { useState, useEffect, useMemo } from "react";

function LightAnimations() {
  const { currentReflection, objects, activeMirrors } = useInteractiveStore();
  const [lightPath, setLightPath] = useState<Point[]>([]);
  const rayToReflection = useMemo(
    () => [currentReflection as Point, objects.observer],
    [currentReflection, objects],
  );

  useEffect(() => {
    const observer = objects.observer;
    const target = objects.obj1;
    const mirrors = [...activeMirrors].map(
      mirrorId => objects[mirrorId] as MirrorObject,
    );

    if (currentReflection) {
      const path = traceRayToObject(
        observer,
        currentReflection,
        target,
        mirrors,
      );
      setLightPath(path);
    }
  }, [objects, currentReflection, activeMirrors]);

  return (
    <>
      {lightPath.length > 0 && currentReflection && (
        <>
          <LightRayPath path={lightPath} color="#6366f1" opacity={1} />
          <LightRayPath path={rayToReflection} color="#6366f1" opacity={0.3} />
        </>
      )}
    </>
  );
}

export default LightAnimations;
