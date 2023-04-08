const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const joi = require("joi");
const jwt = require("jsonwebtoken");
var userSchema = new Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Email: { type: String, required: true },
  Provider: { type: String, default: "nomral" },
  AvatarUrl: { type: String, required: false },
  Password: { type: String, required: true },
  Created: { type: Date, default: Date.now },
  Verified: { type: Boolean, default: false },
});
userSchema.methods.generateAuthToken = function (user) {
  const token = jwt.sign(
    { id: user.id, Email: user.Email },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "24h" }
  );
  return token;
};

const validate = (data) => {
  const schema = joi.object({
    FirstName: joi.string().required().label("FirstName"),
    LastName: joi.string().required().label("LastName"),
    Email: joi.string().email().required().label("Email"),
    Password: joi.string().required().label("Password"),
  });
  return schema.validate(data);
};
const User = mongoose.model("user", userSchema);
module.exports = { User, validate };
