const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');

var Users = require('../Models/Users');
var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get('/', (req, res, next) => {
    res.send('Will send a resource');
});

userRouter.post('/signup', (req, res, next) => {
    Users.register(new Users({userName : req.body.userName}), req.body.password, 
    (error, user) => {
        if(error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({error : error});
        }
        else {
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success : true, status : 'Registration Successfull'});
            });
        }
    });
});

userRouter.post('/login', (req, res, next) => {
    //Which means the first time to authorize himself.
    if(!req.session.user) {
        //authorizationHeader is an encryption of the user name and password 
        //example : 'basic aefdafferfwd622gfad'  
        var authorizationHeader = req.headers.authorization;
        if(!authorizationHeader) {
            var error = new Error('You are NOT authenticated');
            error.status = 401;
            res.setHeader('WWW-Authenticate', 'Basic');
            return next(error);
        }

        var userIdentity = new Buffer.from(authorizationHeader.split(' ')[1], 'base64').toString().split(':');
        var userName = userIdentity[0];
        var password = userIdentity[1];
        
        Users.find({userName : userName})
        .then((user) => {
            if(user == null) {
                var error = new Error(`User ${user} does NOT exist`);
                error.status = 403;
                res.setHeader('WWW-Authenticate', 'Basic');
                return next(error);
            }
            else if(user.password !== password) {
                var error = new Error('Password is INCORRECT');
                error.status = 403;
                res.setHeader('WWW-Authenticate', 'Basic');
                return next(error);
            }
            else {
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }
        })
        .catch((error) => next(error));
    }
    else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'plain/text');
        res.end('You are already authenticated');
    }
})

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
