const User = require("../../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    // const toCheckPssd = await bcrypt.compare(password, user.password)
    const toCheckPssd = password === user.password;
    if (user && toCheckPssd) {
      const jwt_token = jwt.sign(
        {
          userId: user._id,
          email,
        },
        "SecretKey",
        { expiresIn: "24h" }
      );
      return res.status(200).json({
        status: "Success",
        message: "Login Successfull",
        userDetails: {
          token: jwt_token,
          username: user.username,
          email: user.email,
        },
      });
    }
    return res.status(400).send("Invalid Username/Password");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong Try again later!!!!!");
  }
};
