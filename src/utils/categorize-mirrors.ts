import { ActiveMirrors, MirrorObject, ObjectMap } from "../types/interactive";

export default function categorizeMirrors(
  objects: ObjectMap,
  activeMirrors: ActiveMirrors,
): {
  left: MirrorObject | null;
  right: MirrorObject | null;
  top: MirrorObject | null;
} {
  let left = null;
  let right = null;
  let top = null;
  for (const mirrorId of activeMirrors) {
    const mirror = objects[mirrorId] as MirrorObject;
    if (mirror.name?.startsWith("Top")) {
      top = mirror;
    } else if (mirror.name?.startsWith("Left")) {
      left = mirror;
    } else {
      right = mirror;
    }
  }

  return { left, right, top };
}
