let gameStates = {};

const ticTacToeController = function (data) {
  const socket = this;
  const io = require("../socket").getIO();

  if (data.action === "start game") {
    //get socket ids from users connected to this room
    const players = Object.keys(io.sockets.adapter.rooms[socket.room].sockets);
    const gameState = {
      turn: players[0],
      board: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      playerOne: players[0],
      playerTwo: players[1],
      winner: false,
    };
    gameStates[socket.room] = gameState;

    //both players will send the start game event so respond only to current socket
    io.to(socket.id).emit("tic-tac-toe", {
      action: "initial gameState",
      gameState: gameStates[socket.room],
    });
  }

  if (data.action === "place symbol") {
    const gameState = gameStates[socket.room];
    const row = data.position.row;
    const square = data.position.square;
    let playerNumber;
    if (gameState.turn === socket.id && gameState.board[row][square] === 0) {
      if (socket.id === gameState.playerOne) {
        playerNumber = 1;
      } else {
        playerNumber = 2;
      }
      //udate board and switch to other players turn
      if (playerNumber === 1) {
        gameState.board[row][square] = 1;
        gameState.turn = gameState.playerTwo;
      } else {
        gameState.board[row][square] = 2;
        gameState.turn = gameState.playerOne;
      }

      //check for collumn or row win
      for (let i = 0; i < 3; i++) {
        let rowWin = true;
        let collumnWin = true;

        for (let j = 0; j < 3; j++) {
          if (gameState.board[i][j] !== playerNumber) {
            rowWin = false;
          }
        }
        for (let j = 0; j < 3; j++) {
          if (gameState.board[j][i] !== playerNumber) {
            collumnWin = false;
          }
        }
        if (collumnWin || rowWin) {
          gameState.winner = socket.id;
        }
      }
      //check for diagonal win
      if (
        (gameState.board[0][0] === playerNumber &&
          gameState.board[1][1] == playerNumber &&
          gameState.board[2][2] == playerNumber) ||
        (gameState.board[0][2] === playerNumber &&
          gameState.board[1][1] == playerNumber &&
          gameState.board[2][0] == playerNumber)
      ) {
        gameState.winner = socket.id;
      }
      //check for draw
      let draw = true;
      gameState.board.forEach((row) => {
        row.forEach((square) => {
          if (square === 0) {
            draw = false;
          }
        });
      });
      if (draw && !gameState.winner) {
        gameState.winner = "draw";
      }

      gameStates[socket.room] = gameState;

      io.to(socket.room).emit("tic-tac-toe", {
        action: "update gameState",
        gameState: gameStates[socket.room],
      });
    }
  }
};

module.exports = ticTacToeController;
