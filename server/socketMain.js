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
      console.log("A ui client has joined");
      socket.join("ui");
      // on load assume all machines are offline
      Machine.find({}, (err, docs) => {
        console.log("docs", docs);
        docs.forEach(aMachine => {
          aMachine.isActive = false;
          io.to("ui").emit("data", aMachine);
        });
      });
    } else {
      // an invalid client has joined. Good bye
      socket.disconnect(true);
    }
  });

  socket.on("initPerfData", async data => {
    console.log("init data", data.macA);
    // update our function scoped variable
    macA = data.macA;
    console.log("macA", macA);
    const mongooseResponse = await checkAndAdd(data);
    console.log("mongooseResponse", mongooseResponse);
  });

  // A machine has connected.Check to see if it is new.If it is add it.
  socket.on("perfData", data => {
    console.log("Tick...");
    console.log("data", data);
    io.to("ui").emit("data", data);
  });

  socket.on("disconnect", () => {
    Machine.find({ macA: macA }, (err, docs) => {
      if (docs && docs.length) {
        // send one last emit to react
        console.log("disconnected", macA);
        docs[0].isActive = false;
        console.log("docs", docs[0]);
        io.to("ui").emit("data", docs[0]);
      }
    });
  });
}

function checkAndAdd(data) {
  return new Promise((resolve, reject) => {
    Machine.findOne({ macA: data.macA }, (err, doc) => {
      if (err) {
        throw err;
        reject(err);
      } else if (doc === null) {
        // record not in the db so add it
        let newMachine = new Machine(data);
        newMachine.save();
        resolve("added");
      } else {
        // it is in the db so resolve it
        resolve("found");
      }
    });
  });
}
module.exports = socketMain;
