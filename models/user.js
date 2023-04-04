const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;
const joi = require("joi");
const jwt = require("jsonwebtoken");
var userSchema = new Schema({
    FirstName: {type: String,required:true},
    LastName: {type: String,required:true},
    Email: {type: String,required: true},
    Password: {type: String,required:true},
    Created: {type: Date,default: Date.now},
    Followers:[{type:ObjectId,ref:"user"}],
    Following:[{type:ObjectId,ref:"user"}]
})
userSchema.methods.generateAuthToken = function(user){
    const token = jwt.sign({ id: user.id, Email: user.Email }, process.env.JWTPRIVATEKEY, { expiresIn: '24h' })
    return token
}

const validate = (data)=>{
    const schema = joi.object({
        FirstName:joi.string().required().label("FirstName"),
        LastName:joi.string().required().label("LastName"),
        Email:joi.string().email().required().label("Email"),
        Password:joi.string().required().label("Password"),
    });
    return schema.validate(data)
}
const Myfilter = (user,Users,LoggedInUser) =>{
    const remainingUsers = Users.filter((item) => item.id !== LoggedInUser);
    const Following = remainingUsers.filter(obj => user.Following.includes(obj.id));
    const Followers = remainingUsers.filter(obj => user.Followers.includes(obj.id));
    return {
        Following,
        Followers
    }
}
const User = mongoose.model("user",userSchema);
module.exports = {User,validate,Myfilter}