import React from "react";
import drawCircle from "./utilities/canvasLoadAnimation";

const Cpu = props => {
  const canvas = document.querySelector("canvas");
  drawCircle(canvas, props.cpuData.cpuLoad);
  console.log("props", props);
  return (
    <div className="col-sm-3 cpu">
      <h3>CPU Load</h3>
      <div className="canvas-wrapper">
        <canvas className="canvas" height="200" width="200"></canvas>
        <div className="cpu-text">{props.cpuData.cpuLoad}%</div>
      </div>
    </div>
  );
};

export default Cpu;
