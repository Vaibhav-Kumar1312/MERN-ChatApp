const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const validateToken = require("../middleware/auth.js");
const friendInvitationController = require("../controllers/friendInvitation/friendInvitationController.js");

const invitationSchema = Joi.object({
  targetEmail: Joi.string().email(),
});

const inviteDecsionSchema = Joi.object({
  id: Joi.string().required(),
});

router.post(
  "/invite",
  validateToken,
  validator.body(invitationSchema),
  friendInvitationController.postInvite
);

router.post(
  "/accept",
  validateToken,
  validator.body(inviteDecsionSchema),
  friendInvitationController.postAccept
);

router.post(
  "/reject",
  validateToken,
  validator.body(inviteDecsionSchema),
  friendInvitationController.postReject
);

module.exports = router;
