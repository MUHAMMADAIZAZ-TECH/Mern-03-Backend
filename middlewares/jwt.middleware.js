const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers["authorization"].startsWith("Bearer")
  ) {
    token = req.headers["authorization"].split(" ")[1];
  } else if (req.cookies.session) {
    token = req.cookies.session;
  }
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
