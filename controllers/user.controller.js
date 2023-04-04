const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User,validate} = require('../models/user');

exports.signup = async (req, res) => {
  try {
    const {error} = validate({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: req.body.Password,
      });
    if(error){
        return res.status(400).send({
            message:error.details[0].message
        })
    }
    
    let user = registerUser(req)
   
    let userexist = await User.findOne({
        Email:req.body.Email
    });

    if(userexist){
        return res.status(409).send({
          message:"User with given email already exist"
        })
    }
    await user.save();
    res.status(200).json({ message: 'User Successfully Registered' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if(req.body.Email===''){
      return res.status(400).json({ message: 'Email should not be empty' });
    }
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (!isValidPassword(user, req.body.Password)) {
      return res.status(401).json({ accessToken: null, message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user.id, Email: user.Email }, process.env.JWTPRIVATEKEY, { expiresIn: '24h' });
   
    res.status(200).json({
      user: {
        id: user.id,
        Email: user.Email,
        FirstName: user.FirstName,
        LastName: user.LastName,
      },
      message: 'Successfully Login',
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    Following:[],
    Followers:[]
  });
}
