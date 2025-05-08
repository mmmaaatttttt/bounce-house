import {
  ActiveMirrors,
  SceneObject,
  MirrorObject,
  InteractiveSize,
  ObjectMap,
} from "../types/interactive";
import categorizeMirrors from "./categorize-mirrors";
import traceRayToObject from "./trace-ray-to-object";

function reflect(
  object: SceneObject,
  mirror: MirrorObject,
  name: string,
): SceneObject {
  if (mirror.isVertical) {
    const newX = 2 * mirror.x - object.x;
    return { ...object, x: newX, isReflection: true, name };
  }
  const newY = 2 * mirror.y - object.y;
  return { ...object, y: newY, isReflection: true, name };
}

export default function computeReflections(
  objects: ObjectMap,
  activeMirrors: ActiveMirrors,
  gridSize: InteractiveSize,
): SceneObject[] {
  if (activeMirrors.size === 0) {
    return [];
  }

  const reflections: SceneObject[] = [];

  const { top, left, right } = categorizeMirrors(objects, activeMirrors);

  const baseObjects = Object.entries(objects).filter(
    entry => entry[1].type !== "mirror",
  );

  if (!left && !right && !top) {
    return reflections;
  }

  if (top && !(left && right)) {
    baseObjects.forEach(([id, obj]) =>
      reflections.push(reflect(obj, top, `${id}-top`)),
    );
  }

  if ((left && !right) || (right && !left)) {
    const mirror = (left || right) as MirrorObject;
    baseObjects.forEach(([id, obj]) =>
      reflections.push(reflect(obj, mirror, `${id}-side`)),
    );
  }

  if (left && right) {
    const delta = 2 * (right.x - left.x);
    const baseTile: SceneObject[] = [];

    const rightReflections = baseObjects.map(([id, obj]) =>
      reflect(obj, right, `${id}-right`),
    );
    baseTile.push(
      ...baseObjects.map(entries => entries[1]),
      ...rightReflections,
      left,
      right,
    );

    if (top) {
      const topShift = { ...top, x: top.x + delta / 2, isReflection: true };
      const topReflections = [
        ...baseObjects.map(entries => entries[1]),
        ...rightReflections,
        left,
        right,
      ].map(obj => reflect(obj, topShift, "top"));
      baseTile.push(top, topShift, ...topReflections);
    }

    const minShift = Math.ceil(-right.x / delta);
    const maxShift = Math.floor((gridSize.width - left.x) / delta);

    reflections.push(...baseTile);

    for (let shift = minShift; shift <= maxShift; shift++) {
      if (shift !== 0) {
        const shifted = baseTile.map(obj => ({
          ...obj,
          x: obj.x + shift * delta,
          isReflection: true,
          name: `shift-${shift}`,
        }));
        reflections.push(...shifted);
      }
    }
  }

  const mirrors = [left, right, top].filter(Boolean) as MirrorObject[];
  const threshold = 1e-6;
  return reflections.filter(reflection => {
    if (reflection.type === "mirror") return true;
    const rayPoints = traceRayToObject(
      objects.observer,
      reflection,
      reflection.type === "observer" ? objects.observer : objects.obj1,
      mirrors,
    );
    return rayPoints.slice(1, -1).every(point => {
      if (left && Math.abs(point.x - left.x) < threshold) {
        return (
          point.y >= left.y - left.length / 2 - threshold &&
          point.y <= left.y + left.length / 2 + threshold
        );
      }
      if (right && Math.abs(point.x - right.x) < threshold) {
        return (
          point.y >= right.y - right.length / 2 &&
          point.y <= right.y + right.length / 2
        );
      }
      if (top && Math.abs(point.y - top.y) < threshold) {
        return (
          point.x <= top.x + top.length / 2 - threshold &&
          point.x >= top.x - top.length / 2 + threshold
        );
      }
      return true;
    });
  });
}
