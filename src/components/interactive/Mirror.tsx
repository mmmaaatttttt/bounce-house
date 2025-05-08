import { MirrorProps } from "../../types/interactive";

const THICKNESS = 8;

function Mirror({
  x,
  y,
  isVertical,
  length,
  isReflection = false,
}: MirrorProps) {
  const reflection = isReflection ? "reflection" : "";
  const classNames = `mirror-rect ${reflection}`;

  if (isVertical) {
    return (
      <rect
        x={x - THICKNESS / 2}
        y={y - length / 2}
        width={THICKNESS}
        height={length}
        className={classNames}
      />
    );
  }

  return (
    <rect
      x={x - length / 2}
      y={y - THICKNESS / 2}
      width={length}
      height={THICKNESS}
      className={classNames}
    />
  );
}

export default Mirror;
