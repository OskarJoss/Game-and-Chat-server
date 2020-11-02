let roomCounter = 1;
let usersPong = [];
let usersTicTacToe = [];

const roomController = function (data) {
  const socket = this;
  const io = require("../socket").getIO();

  let users = [];

  if (data.pickedGame === "tic-tac-toe") {
    users = usersTicTacToe;
  }
  if (data.pickedGame === "pong") {
    users = usersPong;
  }

  if (data.action === "join room") {
    if (users.length === 1 && users[0].connected) {
      //maby check if user is trying to connect with them selves
      socket.room = users[0].room;
      socket.join(socket.room);
      io.to(socket.room).emit("room", {
        action: "joined room",
      });
      return;
    }

    users = [];
    socket.room = `room${roomCounter}`;
    roomCounter++;
    socket.join(socket.room);
    users.push(socket);

    if (data.pickedGame === "tic-tac-toe") {
      usersTicTacToe = users;
    }
    if (data.pickedGame === "pong") {
      usersPong = users;
    }
  }
};

module.exports = roomController;
