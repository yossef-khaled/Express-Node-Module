const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');

var authenticate = require('../Authenticate');

var Users = require('../Models/Users');
var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get('/', (req, res, next) => {
    res.send('Will send a resource');
});

userRouter.post('/signup', (req, res, next) => {
    Users.register(new Users({username : req.body.username}), req.body.password, 
    (error, user) => {
        if(error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({error : error});
        }
        else {
            passport.authenticate('local')(req, res, () => {
                var token = authenticate.getToken({_id : req.user._id});
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success : true, token : token, status : 'Registration Successfull'});
            });
        }
    });
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
    var token = authenticate.getToken({_id : req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success : true, token : token, status : 'You are successfully logged in'});
});

userRouter.get('/logout', (req, res, next) => {
    if(req.session) {
        req.session.destroy();
        res.clearCookie('sessionID');
        res.redirect('/');
    }
    else {
        var error = new Error('You are NOT logged in !!');
        error.status = 403;
        next(error);
    }
});

module.exports = userRouter;
