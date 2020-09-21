var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var Users = require('./Models/Users');

var jwtStrategy = require('passport-jwt').Strategy;
var extractJWT = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var configuration = require('./Config');

exports.local = passport.use(new localStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, configuration.secretKey, {expiresIn : 3600}); 
}

var options = {};
options.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = configuration.secretKey;

exports.jwtPassport = passport.use(new jwtStrategy(options, 
    (jwt_payload, done) => {
        console.log(`Pay load is : ${jwt_payload}`);
        Users.findOne({_id : jwt_payload._id}, (error, user) => {
            if(error) {
                return done(error, false);
            }
            else if(user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session : false});