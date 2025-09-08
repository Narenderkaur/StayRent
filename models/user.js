const { required } = require('joi');
const mongoose = require ('mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
});

//you can skip writing the manual code for hashing, salting, and verifying passwords 
//It implements automatically -> username, hash ,salting and hashed password by plugin
userSchema.plugin(passportLocalMongoose);     

module.exports = mongoose.model("User",userSchema);
