const express = require('express');
const http = require('http');
const morgan = require('morgan');

const hostName = 'Localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));

app.use(express.static(__dirname + '/Public'));

app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`<html><body><h1>This is an express server</h1></body></html>`);
});

const server = http.createServer(app);

server.listen(port, hostName, () => {
    console.log(`Server is runnind at http://${hostName}:${port}`);
});