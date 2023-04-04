const {User} = require('../models/user');
exports.search = async (req, res) => {
    try {
      let result = await User.find({
        "$or":[
          {"FirstName":{$regex:req.body.searchQuery}},
          {"Email":{$regex:req.body.searchQuery}}
        ]
      }).select('-Password');
      
      if(result.length>0){
        const FinalFilteredArray = result.filter((item) => item.id !== req.body.UserId);
        res.status(200).json({ message: 'Success' ,ListOfUsers:FinalFilteredArray});
      }
      else{
        res.status(200).json({ message: 'No Result Found' ,ListOfUsers:[]});
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };