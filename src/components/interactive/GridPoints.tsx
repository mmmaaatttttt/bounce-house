import { useState, useEffect } from "react";
import * as d3 from "d3";
import useInteractiveStore from "../../store/useInteractiveStore";
import categorizeMirrors from "../../utils/categorize-mirrors";

function GridPoints() {
  const { interactiveSize, gridSize, gridVisible, objects, activeMirrors } =
    useInteractiveStore();
  const { top, left, right } = categorizeMirrors(objects, activeMirrors);

  const [gridOpacity, setGridOpacity] = useState(0);

  useEffect(() => {
    if (gridVisible) {
      d3.select(".grid-container")
        .transition()
        .duration(300)
        .style("opacity", 1);
      setGridOpacity(1);

      d3.selectAll(".grid-point")
        .attr("r", 0)
        .transition()
        .duration(400)
        .ease(d3.easeBounceOut)
        .attr("r", 2.5);
    } else {
      d3.select(".grid-container")
        .transition()
        .duration(300)
        .style("opacity", 0);
      setGridOpacity(0);

      d3.selectAll(".grid-point").transition().duration(300).attr("r", 0);
    }
  }, [gridVisible]);

  return (
    <g className="grid-container" style={{ opacity: gridOpacity }}>
      {Array.from({
        length: Math.floor(interactiveSize.width / gridSize) + 1,
      }).map((_, i) =>
        Array.from({
          length: Math.floor(interactiveSize.height / gridSize) + 1,
        }).map((_, j) => {
          const x = i * gridSize;
          const y = j * gridSize;

          if (right && x >= right.x) return null;
          if (left && x <= left.x) return null;
          if (top && y <= top.y) return null;

          return (
            <circle
              key={`point-${i}-${j}`}
              cx={x}
              cy={y}
              r={0}
              className="grid-point"
            />
          );
        }),
      )}
    </g>
  );
}

export default GridPoints;
