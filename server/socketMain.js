const mongoose = require("mongoose");
const Machine = require("./models/Machine");

const mongoURI =
  "mongodb+srv://anuragb26:anuragb26@cluster0-nx9b3.mongodb.net/perfData?retryWrites=true&w=majority";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

/*
 entrypoint for all  clusters which will make workers 
 and the workers will do the Socket.io handling 

 */

function socketMain(io, socket) {
  console.log("A socket connected", socket.id);
  let macA;
  socket.on("clientAuth", authKey => {
    if (authKey === "fsdfdhfidsuhfi") {
      // valid node client
      socket.join("clients");
    } else if (authKey === "fsdfdsfbiuewerg") {
      // valid ui client has joined
      socket.join("ui");
    } else {
      // an invalid client has joined. Good bye
      socket.disconnect(true);
    }
  });

  socket.on("initPerfData", data => {
    console.log("init data", data.macA);
    // update our function scoped variable
    macA = data.macA;
    console.log("macA", macA);
    //  checkAndAdd(macA);
  });

  // A machine has connected.Check to see if it is new.If it is add it.
  socket.on("perfData", data => {
    console.log("data", data);
  });
}

module.exports = socketMain;
