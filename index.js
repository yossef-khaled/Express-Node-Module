const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./Routes/DishRouter');

const hostName = 'Localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

//Connect the index.js file with the routes from our 'dish-router'
app.use('/dishes', dishRouter);
app.use('/dishes/:dishID', dishRouter);

app.use(express.static(__dirname + '/Public'));

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