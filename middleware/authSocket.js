const jwt = require("jsonwebtoken");

const verifyTokenSocket = (socket, next) => {
  const token = socket.handshake.auth?.token;
  try {
    const decoded = jwt.verify(token, "SecretKey");
    socket.user = decoded;
  } catch (err) {
    const socketErr = new Error("NOT AUTHORIZED");
    return next(socketErr);
  }

  next();
};

module.exports = verifyTokenSocket;
