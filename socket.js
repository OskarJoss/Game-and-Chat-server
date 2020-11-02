const roomController = require("./controllers/room");
const chatController = require("./controllers/chat");
const ticTacToeController = require("./controllers/ticTacToe");
const pongController = require("./controllers/pong");
const disconnectController = require("./controllers/disconnect");

let io;
let userCounter = 1;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      pingTimeout: 60000,
    });

    io.on("connection", (socket) => {
      socket.username = `user${userCounter}`;
      userCounter++;
      console.log(`${socket.username} connected`);

      socket.on("room", roomController);
      socket.on("chat", chatController);
      socket.on("tic-tac-toe", ticTacToeController);
      //pong is a reserved eventname
      socket.on("pong-game", pongController);
      socket.once("disconnect", disconnectController);
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("socket.io not initialized");
    }
    return io;
  },
};
