const User = require("../../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    const userExists = await User.exists({ email });
    if (userExists) {
      return res.status(409).send("E-mail already exists");
    }
    // encrypt password with help of bcrypt
    // const encryptedPsswd = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      username: username,
      email: email,
      password: password,
    });

    const jwt_token = jwt.sign(
      {
        userId: createdUser._id,
        email,
      },
      "SecretKey",
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      status: "Success",
      message: "User registration successfully done",
      userDetails: {
        username: createdUser.username,
        token: jwt_token,
        email: createdUser.email,
      },
    });
  } catch (err) {
    return res.status(500).send("Failed to register user");
  }
}

module.exports = register;
