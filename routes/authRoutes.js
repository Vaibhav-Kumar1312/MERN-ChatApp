const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/authControllers.js");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const validateToken = require("../middleware/auth.js");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(12),
  password: Joi.string().min(6).max(12),
  email: Joi.string().email(),
});
const loginSchema = Joi.object({
  password: Joi.string().min(6).max(12),
  email: Joi.string().email(),
});

router.post(
  "/register",
  validator.body(registerSchema),
  authController.controller.postRegister
);
router.post(
  "/login",
  validator.body(loginSchema),
  authController.controller.postLogin
);

router.get("/test", validateToken);

module.exports = router;
