const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var dashboardSchema = new Schema({
    Heading:{type: String,required:true},
    Title:{type: String,required:true},
    Text:{type: String,required: true},
})
const JiraDashboard = mongoose.model("JiraDashboard",dashboardSchema);
module.exports = {JiraDashboard};