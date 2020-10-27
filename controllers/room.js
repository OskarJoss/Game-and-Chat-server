let roomCounter = 1;
let users = [];

const roomController = function (data) {
  const socket = this;
  const io = require("../socket").getIO();

  if (data.action === "join room") {
    if (users.length === 1 && users[0].connected) {
      //maby check if user is trying to connect with them selves
      socket.room = users[0].room;
      //maby push user to users instead and use order for player1/player2
      users = [];
      socket.join(socket.room);
      io.to(socket.room).emit("room", {
        action: "joined room",
      });
      //send data from front-end on what game to play
      io.to(socket.room).emit("room", {
        action: "picked game",
        game: "tic-tac-toe",
      });
      return;
    }

    users = [];
    socket.room = `room${roomCounter}`;
    roomCounter++;
    socket.join(socket.room);
    users.push(socket);
  }
};

module.exports = roomController;
