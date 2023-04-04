const { User , Myfilter } = require('../models/user');
exports.getLists = async (req, res) => {
    try {
        const { LoggedInUser } = req.body;

        let user = await User.findOne({_id:LoggedInUser});
        let users = await User.find().select('-Password');

        const { Following, Followers } = Myfilter(user,users,LoggedInUser)

        res.status(200).json({ Followers: Followers,Following:Following});
    } catch (error) {
       res.status(500).json({ message: 'Internal Server Error' });
    }
  };
