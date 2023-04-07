const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, data) => {
    if (err || data.email !== req.body.email) {
      return res.sendStatus(403);
    }
    next();
  });
};
