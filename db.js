const mongoose = require("mongoose");

module.exports = () =>{
    const connectionParams = {
        useUnifiedTopology:true,
        useNewUrlParser: true
    }
    try{
        mongoose.connect(process.env.DB,connectionParams)
        console.log("Connected to database success")
    }catch(error){
    console.log("Error",error)
    console.log("Not Connected to database")
    }
}
