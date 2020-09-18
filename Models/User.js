var mongoose = require('mongoose');
var schema = mongoose.Schema;

var User = new Schema({
    userName : {
        type: String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    admin : {
        type : Boolean,
        default : false
    }
});

var Users = mongoose.model('User', User);
module.exports = Users;