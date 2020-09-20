var mongoose = require('mongoose');
const passport = require('passport');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin : {
        type : Boolean,
        default : false
    }
});

User.plugin(passportLocalMongoose);

var Users = mongoose.model('User', User);
module.exports = Users;