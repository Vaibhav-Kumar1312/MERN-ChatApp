const User = require("../../models/user.js");
const FriendInvitation = require("../../models/friendInvitation.js");
const friendUpdate = require("../../socketHandlers/updates/friends.js");

module.exports.postInvite = async function postInvite(req, res) {
  const { targetEmail } = req.body;
  const { userId, email } = req.user;
  if (email === targetEmail) {
    console.log("same email");
    return res.status(409).send("Cannot invite yourself");
  }
  const targetUser = await User.findOne({ email: targetEmail });
  if (!targetUser) {
    return res.status(404).send(`User--${targetEmail} Does Not Exist`);
  }

  const invitationAlreadySent = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });
  if (invitationAlreadySent) {
    return res.status(409).send("Invitation already sent");
  }

  const userAlreadyFriend = targetUser.friends.find(
    (frndId) => frndId.toString() === userId.toString()
  );

  if (userAlreadyFriend) {
    return res.status(409).send("Friend Already added check friend list");
  }

  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // send pending inviataion update to specific user
  friendUpdate.updateFriendsPendingInvitation(targetUser._id.toString());

  return res.status(201).send("Invitation has been sent");
};

module.exports.postAccept = async function postAccept(req, res) {
  try {
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);
    if (!invitation) {
      return res.status(401).send("Error Occured please try again");
    }
    const { senderId, receiverId } = invitation;

    // add friends to both users
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    senderUser.save();
    receiverUser.save();

    // delete Invitation
    await FriendInvitation.findByIdAndDelete(id);

    // update list of friends if the users are online
    friendUpdate.updateFriends(senderId.toString());
    friendUpdate.updateFriends(receiverId.toString());

    // update list of friend's pending invitation
    friendUpdate.updateFriendsPendingInvitation(receiverId.toString());

    return res.status(200).send("Friend Successfully added");
  } catch (err) {
    console.log(err);
    return res.status(500).send("something went wrong");
  }
};

module.exports.postReject = async function postReject(req, res) {
  try {
    const { id } = req.body;
    const { userId } = req.user;
    const invitationExists = await FriendInvitation.exists();
    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // update pending invitations
    friendUpdate.updateFriendsPendingInvitation(userId);
    return res.status(200).send("Invitaion rejected successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something wemt wrong");
  }
};
