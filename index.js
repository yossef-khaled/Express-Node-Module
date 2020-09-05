const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const hostName = 'Localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.all('/dishes', (req, res, next) => {
    res.statusCode = 200;
    res.setHeaders('Content-Type', 'text/plain');
    next();
});

app.get('/dishes', (req, res, next) => {
    res.end('Will send all the dishes');
});

app.post('/dishes', (req, res, next) => {
    res.end(`Will add the dish : ${req.body.name} with the details ${req.body.description}`);
});

app.put('/dishes', (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported in this end point '/dishes'`);
});

app.delete('/dishes', (req, res, next) => {
    res.end('Will delete all the dishes');
});

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