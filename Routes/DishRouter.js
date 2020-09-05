const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//CRUD for the endpoint /dishes
dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the dishes');
})
.post((req, res, next) => {
    res.end(`Will add the dish : "${req.body.name}" with the details "${req.body.description}"`);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported in this end point '/dishes'`);
})
.delete((req, res, next) => {
    res.end('Will delete all the dishes');
});

//CRUD for the endpoint /dishes/:dishID
dishRouter.route('/:dishID') 
.get((req, res, next) => {
    res.end(`Will send back details of dishe number : ${req.params.dishID}`);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported in this end point '/dishes/:${req.params.dishID}'`);
})
.put((req, res, next) => {
    res.end(`Will update the dish number: ${req.params.dishID}`);
})
.delete((req, res, next) => {
    res.end(`Deleting dish number: ${req.params.dishID}`);
});

module.exports = dishRouter;
