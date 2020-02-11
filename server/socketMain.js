/*
 entrypoint for all  clusters which will make workers 
 and the workers will do the Socket.io handling 

 */

function socketMain(io, socket) {
  console.log("A socket connected", socket.id);
}

module.exports = socketMain;
