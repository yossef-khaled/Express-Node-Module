const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./Authenticate');

var configure = require('./Config');

const dishRouter = require('./Routes/DishRouter');
const userRouter = require('./Routes/UsersRouter');

const mongoose = require('mongoose');

const Dishes = require('./Models/Dishes');
const { config } = require('process');

const url = configure.mongoURL;
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log('Connected to the server proberlly');
}, (error) => {console.log(`ERROR connecting to the server : ${error}`); });

const hostName = 'Localhost';
const port = 3000;

var app = express();

app.all('*', (req, res, next) => {
    if(req.secure) {
        return next();
    }
    else {
        //Redirect any http request into the https port
        res.redirect(307, `https://${req.hostname}:${app.get('securePort')}${req.url}`);
    }
})

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false}));
//app.use(cookieParser('12345-67890-09876-54321'));

 
app.use(session({
    name: 'sessionID',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new fileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', userRouter);

//Use HTML files as a static data
app.use(express.static(path.join(__dirname + '/Public')));

//Connect the index.js file with the routes from our 'dish-router'
app.use('/dishes', dishRouter);
app.use('/dishes/:dishID', dishRouter);


app.use((req, res, next) => {
    console.log(req.method);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`<html><body><h1>This is an express server</h1></body></html>`);
});

const server = http.createServer(app);

server.listen(port, hostName, () => {
    console.log(`Server is runnind at http://${hostName}:${port}`);
});