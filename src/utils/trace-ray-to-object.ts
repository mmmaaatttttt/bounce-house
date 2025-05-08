import { Point, MirrorObject } from "../types/interactive";

function reflectDirection(dir: Point, mirror: MirrorObject): Point {
  if (mirror.isVertical) return { x: -dir.x, y: dir.y };
  return { x: dir.x, y: -dir.y };
}

function getDirection(from: Point, to: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mag = Math.hypot(dx, dy);
  return { x: dx / mag, y: dy / mag };
}

export default function traceRayToObject(
  observer: Point,
  reflection: Point,
  target: Point,
  mirrors: MirrorObject[],
): Point[] {
  const result: Point[] = [observer];
  let current = { ...observer };
  let dir = getDirection(observer, reflection);
  const threshold = 1e-6;

  while (true) {
    let closestDist = Infinity;
    let hits: { mirror: MirrorObject; point: Point }[] = [];

    for (const mirror of mirrors) {
      if (mirror.isVertical) {
        if (dir.x === 0) continue;
        const t = (mirror.x - current.x) / dir.x;
        if (t <= 0) continue;
        const yHit = current.y + t * dir.y;
        const point = { x: mirror.x, y: yHit };
        const dist = Math.hypot(point.x - current.x, point.y - current.y);
        if (Math.abs(yHit - mirror.y) <= mirror.length / 2 + threshold) {
          if (Math.abs(dist - closestDist) < threshold) {
            hits.push({ mirror, point });
          } else if (dist < closestDist - threshold) {
            closestDist = dist;
            hits = [{ mirror, point }];
          }
        }
      } else {
        if (dir.y === 0) continue;
        const t = (mirror.y - current.y) / dir.y;
        if (t <= 0) continue;
        const xHit = current.x + t * dir.x;
        const point = { x: xHit, y: mirror.y };
        const dist = Math.hypot(point.x - current.x, point.y - current.y);
        if (Math.abs(xHit - mirror.x) <= mirror.length / 2 + threshold) {
          if (Math.abs(dist - closestDist) < threshold) {
            hits.push({ mirror, point });
          } else if (dist < closestDist - threshold) {
            closestDist = dist;
            hits = [{ mirror, point }];
          }
        }
      }
    }

    const toTarget = getDirection(current, target);
    const cosTheta = dir.x * toTarget.x + dir.y * toTarget.y;
    const distToTarget = Math.hypot(target.x - current.x, target.y - current.y);

    if (Math.abs(cosTheta - 1) < threshold && distToTarget < closestDist) {
      result.push({ ...target });
      break;
    }

    if (hits.length > 0) {
      current = hits[0].point;
      result.push({ ...current });

      for (const hit of hits) {
        dir = reflectDirection(dir, hit.mirror);
      }
    } else {
      break;
    }
  }

  return result.reverse();
}
