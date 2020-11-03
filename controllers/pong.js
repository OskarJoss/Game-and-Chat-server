let gameStates = {};

const pongController = function (data) {
  const socket = this;
  const io = require("../socket").getIO();

  if (data.action === "start game") {
    const alreadySent = gameStates[socket.room];
    //get socket ids from users connected to this room
    const players = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);
    const gameState = {
      playerOne: players[0],
      playerTwo: players[1],
      winner: false,
    };
    gameStates[socket.room] = gameState;

    if (!alreadySent) {
      io.to(socket.room).emit("pong-game", {
        action: "initial gameState",
        gameState: gameStates[socket.room],
      });
    }
  }

  if (data.action === "pad position") {
    let otherPlayer;
    const gameState = gameStates[socket.room];

    //got a problem with gameState being undefined some times
    if (gameState) {
      if (socket.id === gameState.playerOne) {
        otherPlayer = gameState.playerTwo;
      } else {
        otherPlayer = gameState.playerOne;
      }
      io.to(otherPlayer).emit("pong-game", {
        action: "opponent pad position",
        position: data.position,
      });
    }
  }
};

module.exports = pongController;
