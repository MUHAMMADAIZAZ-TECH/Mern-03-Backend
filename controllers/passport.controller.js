const jwt = require("jsonwebtoken");
exports.loginsuccess = async (req, res) => {
  if (req.user) {
    const token = jwt.sign(req.user, process.env.JWTPRIVATEKEY, {
      expiresIn: "24h",
    });
    res
      .cookie("session", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        user: req.user,
        message: "Successfully Login",
      });
  }
};
exports.loginfailed = async (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
};
exports.logout = async (req, res, next) => {
  req.logout(function (err) {
    console.log(err);
    if (err) {
      return next(err);
    }
  });
  res.cookie("session", "", { maxAge: -1 });
  res.redirect(process.env.BASE_URL);
};
