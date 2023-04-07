exports.loginsuccess = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      cookies: req.cookies,
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
  res.redirect(process.env.BASE_URL);
};
exports.isUserAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send("You must login first!");
  }
};
