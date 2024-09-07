const serverStore = require("../serverStore");

const disconnectHandler = async (socket) => {
  console.log("disconnect runned");
  serverStore.removeConnectedUser(socket.id);
};

module.exports = disconnectHandler;
