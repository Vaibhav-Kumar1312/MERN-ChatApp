const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  let token = req.body.token || req.query.token || req.headers["authorization"];
  if (!token) {
    return res.status(403).send("Token Not Present in request");
  }
  try {
    token = token.replace(/^Bearer\s+/, "");
    const decodedData = jwt.verify(token, "SecretKey");
    // console.log(decodedData);
    req.user = decodedData;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
