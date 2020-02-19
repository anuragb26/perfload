import React, { useState, useEffect } from "react";
import socket from "./utilities/socketConnection";
import Widget from "./Widget";
import "./App.css";

function App() {
  const [performanceData, setPerformanceData] = useState({});

  socket.on("data", data => {
    // inside this callback we got new data
    // update state to rerender app
    console.log("performanceData inside", performanceData);
    const currentPeformanceData = { ...performanceData };
    console.log("macA", data);
    currentPeformanceData[data.macA] = data;
    setPerformanceData(currentPeformanceData);
  });
  // console.log("performanceData", performanceData);
  const widgets = [];
  Object.entries(performanceData).forEach(([key, value]) => {
    widgets.push(<Widget key={key} data={value} />);
  });
  return <div className="App">{widgets}</div>;
}

export default App;
