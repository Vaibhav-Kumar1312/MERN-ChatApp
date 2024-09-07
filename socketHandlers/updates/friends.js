const User = require("../../models/user.js");
const FriendInvitation = require("../../models/friendInvitation.js");
const serverStore = require("../../serverStore.js");

const updateFriendsPendingInvitation = async (userId) => {
  try {
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate("senderId", "_id username email");

    //   find all active connections of specified user
    const receiverList = serverStore.getActiveConnections(userId);
    const io = serverStore.getSocketServerInstance();
    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friend-invitation", {
        pendingInvitation: pendingInvitations ? pendingInvitations : [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const updateFriends = async (userId) => {
  try {
    // find active connnections of specific id (online users)
    const receiverList = serverStore.getActiveConnections(userId);
    if (receiverList.length > 0) {
      const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
        "friends",
        "_id username email"
      );
      // console.log(user);
      if (user) {
        const friendsList = user.friends.map((f) => {
          return {
            id: f._id,
            email: f.email,
            username: f.username,
          };
        });
        // get socket server instance
        const io = serverStore.getSocketServerInstance();
        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit("friend-list", {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  updateFriendsPendingInvitation,
  updateFriends,
};
