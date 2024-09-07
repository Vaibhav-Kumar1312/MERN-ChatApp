const verifyToken = require("./middleware/authSocket.js");
const newConnectionHandler = require("./socketHandlers/newConnectionHandler.js");
const disconnectHandler = require("./socketHandlers/disconnectHandler.js");
const serverStore = require("./serverStore.js");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  serverStore.setSocketServerInstance(io);

  io.use((socket, next) => {
    verifyToken(socket, next);
  });

  const emitOnlineUsers = () => {
    console.log("emit runned");
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  io.on("connection", (socket) => {
    console.log("user connected to socket");
    console.log(socket.id);
    newConnectionHandler(socket, io);
    emitOnlineUsers();
    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 8000);
};

module.exports = {
  registerSocketServer,
};
