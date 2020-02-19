import React from "react";
import drawCircle from "./utilities/canvasLoadAnimation";

const Mem = props => {
  console.log("props", props);
  const { totalMem, usedMem, memUsage, freeMem } = props.memData;
  const canvas = document.querySelector(`.${props.memData.memWidgetId}`);
  drawCircle(canvas, memUsage * 100);
  console.log("totalMem", totalMem);
  const totalMemInGb = Math.floor((totalMem / 1073741824) * 100) / 100;
  const freeMemInGb = Math.floor((freeMem / 1073741824) * 100) / 100;
  return (
    <div className="col-sm-3 mem">
      <h3>Memory Usage</h3>
      <div className="canvas-wrapper">
        <canvas
          className={props.memData.memWidgetId}
          width="200"
          height="200"
        ></canvas>
        <div className="mem-text">{memUsage * 100}%</div>
      </div>
      <div>Total Memory: {totalMemInGb} GB</div>
      <div>Free Memory: {freeMemInGb} GB</div>
    </div>
  );
};

export default Mem;
