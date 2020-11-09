const disconnectController = function () {
  const socket = this;
  const io = require("../socket").getIO();

  console.log(`${socket.username} disconnected`);
  if (socket.room) {
    io.to(socket.room).emit("room", { action: "opponent disconnected" });
  }
};

module.exports = disconnectController;
