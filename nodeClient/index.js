/*
- CPU load (current)
- Memory Usage
    - free
    - total
- Os type
- Uptime 
- CPU Info
    - Type
    - Number of cores 
    - Clock Speed
*/
const os = require("os");
const io = require("socket.io-client");
let socket = io("http://127.0.0.1:8181");

socket.on("connect", () => {
  // we need a way to identify this machine to whomsoever concerned
  console.log("I connected to the socket server...hooray");
  const nI = os.networkInterfaces();
  let macA;
  // loop through all the network interfaces for this machine and find a non-internal one
  for (let key in nI) {
    if (!nI[key][0].internal) {
      macA = nI[key][0].mac;
      break;
    }
  }
  // client Auth with single key value
  socket.emit("clientAuth", "fsdfdhfidsuhfi");

  performanceData().then(allPerformanceData => {
    allPerformanceData.macA = macA;
    socket.emit("initPerfData", allPerformanceData);
  });

  let perfDataInterval = setInterval(() => {
    performanceData().then(allPerformanceData => {
      allPerformanceData.macA = macA;
      socket.emit("perfData", allPerformanceData);
    });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(perfDataInterval);
  });
});

const performanceData = () => {
  return new Promise(async (resolve, reject) => {
    const osType = os.type() === "Darwin" ? "Mac" : os.type();
    const upTime = os.uptime();
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const cpus = os.cpus();
    const cpuModel = cpus[0].model;
    const numCores = cpus.length;
    const cpuSpeed = cpus[0].speed;
    const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;
    const cpuLoad = await getCpuLoad();
    resolve({
      osType,
      upTime,
      freeMem,
      totalMem,
      usedMem,
      cpuModel,
      numCores,
      cpuSpeed,
      memUsage,
      cpuLoad
    });
  });
};

const cpuAverage = () => {
  // get Ms in each mode but this number is since reboot
  // so get it now and get it in 100ms and compare
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;
  cpus.forEach(aCore => {
    for (type in aCore.times) {
      totalMs += aCore.times[type];
    }
    idleMs += aCore.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length
  };
};

/*
        because the times property is timed since boot, we will get 
        // now times and 100ms from now times.Compare them , that will give us current load.
  */
const getCpuLoad = async () => {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();

    setTimeout(() => {
      const end = cpuAverage();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;
      // % of used cpu
      const percentageCpu =
        100 - Math.floor((100 * idleDifference) / totalDifference);
      resolve(percentageCpu);
    }, 100);
  });
};
