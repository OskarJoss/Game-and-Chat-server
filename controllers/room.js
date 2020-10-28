let roomCounter = 1;
let usersPong = [];
let usersTicTacToe = [];

const roomController = function (data) {
  const socket = this;
  const io = require("../socket").getIO();

  let pong;
  let ticTacToe;

  if (data.pickedGame === "tic-tac-toe") {
    ticTacToe = true;
  }
  if (data.pickedGame === "pong") {
    pong = true;
  }

  if (data.action === "join room") {
    if (pong && usersPong.length === 1 && usersPong[0].connected) {
      //maby check if user is trying to connect with them selves
      socket.room = usersPong[0].room;
      //maby push user to users instead and use order for player1/player2
      usersPong = [];
      socket.join(socket.room);
      io.to(socket.room).emit("room", {
        action: "joined room",
        pickedGame: "pong",
      });
      return;
    }

    if (
      ticTacToe &&
      usersTicTacToe.length === 1 &&
      usersTicTacToe[0].connected
    ) {
      //maby check if user is trying to connect with them selves
      socket.room = usersTicTacToe[0].room;
      //maby push user to users instead and use order for player1/player2
      usersTicTacToe = [];
      socket.join(socket.room);
      io.to(socket.room).emit("room", {
        action: "joined room",
        pickedGame: "tic-tac-toe",
      });
      return;
    }

    if (pong) {
      usersPong = [];
    }
    if (ticTacToe) {
      usersTicTacToe = [];
    }
    socket.room = `room${roomCounter}`;
    roomCounter++;
    socket.join(socket.room);
    if (pong) {
      usersPong.push(socket);
    }
    if (ticTacToe) {
      usersTicTacToe.push(socket);
    }
  }
};

module.exports = roomController;
