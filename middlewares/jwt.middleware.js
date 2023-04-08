const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
exports.authenticate = async (req, res, next) => {
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
    if (decoded) {
      req.user = decoded;
    }
    // if(decoded){
    //   const userexist = await User.findOne({ Email: decoded.Email});
    //   if (userexist) {
    //     req.user = decoded;
    //   } else {
    //     return res.status(401).send("Unauthorized access");
    //   }
    // }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
