const chatController = function (data) {
  const socket = this;
  const io = require("../socket").getIO();

  if (data.action === "send message") {
    //maby need to check that socket.room is set
    io.to(socket.room).emit("chat", {
      action: "incoming message",
      message: data.message,
    });
  }
};

module.exports = chatController;
