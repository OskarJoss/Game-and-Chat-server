let gameStates = {};

const pongController = function (data) {
  const socket = this;
  const io = require("../socket").getIO();

  //set ball starting direction in gameState here
  if (data.action === "start game") {
    const alreadySent = gameStates[socket.room];
    //get socket ids from users connected to this room
    const players = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);
    const gameState = {
      playerOne: players[0],
      playerTwo: players[1],
      score: {
        playerOne: 0,
        playerTwo: 0,
      },
      winner: false,
    };
    gameStates[socket.room] = gameState;

    if (socket.id === gameState.playerOne) {
      socket.opponent = gameState.playerTwo;
    } else {
      socket.opponent = gameState.playerOne;
    }

    //send initial gameState to room once
    if (!alreadySent) {
      io.to(socket.room).emit("pong-game", {
        action: "initial gameState",
        gameState: gameStates[socket.room],
      });
    }
  }

  if (data.action === "ball position") {
    io.to(socket.room).emit("pong-game", {
      action: "new ball position",
      posX: data.posX,
      posY: data.posY,
      velX: data.velX,
      velY: data.velY,
    });
  }

  if (data.action === "pad position") {
    io.to(socket.opponent).emit("pong-game", {
      action: "opponent pad position",
      position: data.position,
    });
  }

  //check for win here
  if (data.action === "lost point") {
    const gameState = gameStates[socket.room];
    let winner;

    if (socket.id === gameState.playerOne) {
      gameState.score.playerTwo += 1;
    } else {
      gameState.score.playerOne += 1;
    }

    if (gameState.score.playerOne >= 3) {
      gameState.winner = gameState.playerOne;
    }
    if (gameState.score.playerTwo >= 3) {
      gameState.winner = gameState.playerTwo;
    }
    gameStates[socket.room] = gameState;

    io.to(socket.room).emit("pong-game", {
      action: "point scored",
      gameState: gameState,
    });
  }
};

module.exports = pongController;
