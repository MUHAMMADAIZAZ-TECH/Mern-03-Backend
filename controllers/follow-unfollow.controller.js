const {User,Myfilter} = require('../models/user');
exports.follow = async (req, res) => {
    try {
        const { SecondUser, LoggedInUser } = req.body;
    
        await User.findByIdAndUpdate(
          SecondUser,
          { $push: { Followers: LoggedInUser } },
          { new: true }
        );
    
        const user = await User.findByIdAndUpdate(
          LoggedInUser,
          { $push: { Following: SecondUser } },
          { new: true }
        ).select('-Password');

         let users = await User.find().select('-Password');

         const { Following, Followers } = Myfilter(user,users,LoggedInUser)

         res.status(200).json({ Followers: Followers,Following:Following});
      } catch (error) {
        res.status(422).json({ error: error.message });
      }
  };

  exports.unfollow = async (req, res) => {
    try {
        const { SecondUser, LoggedInUser } = req.body;
    
        await User.findByIdAndUpdate(
          SecondUser,
          { $pull: { Followers: LoggedInUser } },
          { new: true }
        );
    
        const user = await User.findByIdAndUpdate(
          LoggedInUser,
          { $pull: { Following: SecondUser } },
          { new: true }
        ).select('-Password');

        let users = await User.find().select('-Password');

        const { Following, Followers } = Myfilter(user,users,LoggedInUser)

        res.status(200).json({ Followers: Followers,Following:Following});
      } catch (error) {
        res.status(422).json({ error: error.message });
      }
  };
