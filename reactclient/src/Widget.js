import React from "react";
import Cpu from "./Cpu";
import Mem from "./Mem";
import Info from "./Info";

const Widget = props => {
  const {
    osType = "",
    upTime = "",
    freeMem = "",
    totalMem = "",
    usedMem = "",
    cpuModel = "",
    numCores = "",
    cpuSpeed = "",
    memUsage = "",
    cpuLoad = "",
    macA = ""
  } = props.data;
  const cpu = { cpuLoad };
  const mem = { totalMem, usedMem, memUsage };
  const info = { macA, osType, upTime, cpuModel, numCores, cpuSpeed };

  return (
    <div>
      <Cpu cpuData={cpu} />
      <Mem memData={mem} />
      <Info infoData={info} />
    </div>
  );
};

export default Widget;
