const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../Utills/sendEmail");
const joi = require("joi");
//signup
exports.signup = async (req, res) => {
  try {
    const { error } = validate({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Password: req.body.Password,
    });
    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }

    let user = registerUser(req);

    let userexist = await User.findOne({
      Email: req.body.Email,
    });

    if (userexist) {
      return res.status(409).send({
        message: "User with given email already exist",
      });
    }
    let saveduser = await user.save();
    const token = await new Token({
      userId: saveduser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}${saveduser.id}/verify/${token.token}`;
    await sendEmail(saveduser.Email, "verify Email", url);

    res
      .status(201)
      .send({ message: "An Email Sent to your account please verify" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
//signin
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (req.body.Email === "") {
      return res.status(400).json({ message: "Email should not be empty" });
    }
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!isValidPassword(user, req.body.Password)) {
      return res
        .status(401)
        .json({ accessToken: null, message: "Invalid password" });
    }
    if (!user.Verified) {
      let token = await Token.findOne({
        userId: user._id,
      });
      if (!token) {
        const token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}${user._id}/verify${token.token}`;
        await sendEmail(user.Email, "verify Email", url);
      }
      return res
        .status(400)
        .send({ message: "An Email is sent to your account please verify" });
    }
    const token = jwt.sign(
      { id: user.id, Email: user.Email },
      process.env.JWTPRIVATEKEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      user: {
        id: user.id,
        Email: user.Email,
        FirstName: user.FirstName,
        LastName: user.LastName,
      },
      message: "Successfully Login",
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//verfiy token /email verification
exports.emailverification = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).send({ message: "Invalid User", urlValid: false });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).send({ message: "Invalid link", urlValid: false });

    await user.updateOne({ _id: user._id, Verified: true });
    await token.deleteOne();

    res
      .status(200)
      .send({ message: "Email verified successfully", urlValid: true });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.Password);
}

function registerUser(req) {
  return new User({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    Password: bcrypt.hashSync(req.body.Password, 10),
  });
}
const validatesignin = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().label("email"),
    password: joi.string().required().label("password"),
  });
  return schema.validate(data);
};
