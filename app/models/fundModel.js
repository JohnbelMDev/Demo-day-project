// / load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for the user model
// the purpose to use the models is to create,read,updatem or delete items rom the mongodb collection
var fundSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
  // user with the value of string
    user:String,

    fullName:String,
    // amount with the value of number
    amount:Number,
    // currentGoal with the value of number
    currentGoal:Number,
    // title with the value of number
    title:String,

    imgPath:String,
    // description with the value of number
    description:String,
    // date with the value of number
    date:String,

    category:String,

    homeAddress:String,
    // itemsTodonate with the value of number
    itemsTodonate:String,

    donation: Array

});

// FundModel is telling mongoose to name the collection FundModel
module.exports = mongoose.model('FundModel', fundSchema);
