import React, { useState, useEffect } from "react";
import socket from "./utilities/socketConnection";

import "./App.css";

function App() {
  const [performanceData, setPerformanceData] = useState({});
  useEffect(() => {
    socket.on("data", data => {
      console.log(data);
    });
  }, []);
  return (
    <div className="App">
      <h1>Sanity Check!</h1>
    </div>
  );
}

export default App;
