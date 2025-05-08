import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Point } from "../../types/interactive";

interface LightRayPathProps {
  path: Point[];
  color: string;
  opacity?: number;
}

function LightRayPath({ path, color, opacity = 1 }: LightRayPathProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    const line = d3
      .line<Point>()
      .x(d => d.x)
      .y(d => d.y);

    const pathData = line(path) ?? "";
    pathRef.current.setAttribute("d", pathData);

    const totalLength = pathRef.current.getTotalLength();

    d3.select(pathRef.current)
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)

      .transition()
      .duration(800)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }, [path, color, opacity]);

  return (
    <path
      ref={pathRef}
      stroke={color}
      strokeWidth={5}
      fill="none"
      opacity={opacity}
    />
  );
}

export default LightRayPath;
