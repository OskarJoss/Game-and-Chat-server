const roomController = require("./controllers/room");
const chatController = require("./controllers/chat");
const ticTacToeController = require("./controllers/ticTacToe");
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

      //temporary test
      socket.on("test", (data) => {
        console.log(data.message);
        io.emit("test", {
          message: "hello from backend",
        });
      });

      socket.on("room", roomController);
      socket.on("chat", chatController);
      socket.on("tic-tac-toe", ticTacToeController);
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
