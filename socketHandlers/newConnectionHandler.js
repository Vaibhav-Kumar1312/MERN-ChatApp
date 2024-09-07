const serverStore = require("../serverStore.js");
const friends = require("./updates/friends.js");

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;
  serverStore.addNewConnectedUser(socket.id, userDetails.userId);

  // update pending friends invitation List
  friends.updateFriendsPendingInvitation(userDetails.userId);

  // update friends list
  friends.updateFriends(userDetails.userId);
};

module.exports = newConnectionHandler;
