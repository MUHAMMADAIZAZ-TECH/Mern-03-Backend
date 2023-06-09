const { User } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../Utills/sendEmail");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//send password link
exports.sendpasswordlink = async (req, res) => {
  try {
    const emailSchema = Joi.object({
      Email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });
    let user = await User.findOne({ Email: req.body.Email });
    if (!user)
      return res
        .status(409)
        .send({ message: "User with given email does not exist!" });

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}`;
    await sendEmail(user.Email, "password Reset", url);
    res
      .status(200)
      .send({ message: "password reset link sent to your email account" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};
//verify url
exports.verifyurl = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user)
      return res.status(400).send({ message: "Invalid link", urlValid: false });
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token)
      return res.status(500).send({ message: "Invalid link", urlValid: false });

    res.status(200).send({ message: "Valid Url", urlValid: true });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

//new password
exports.newpassword = async (req, res) => {
  try {
    const passwordSchema = Joi.object({
      Password: Joi.string().required().label("Password"),
    });
    const { error } = passwordSchema.validate(res.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });
    if (!user.Verified) user.Verified = true;
    const hashPassword = bcrypt.hashSync(req.body.Password, 10);
    user.Password = hashPassword;
    await user.save();
    await token.deleteOne();

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
    });
  }
};
