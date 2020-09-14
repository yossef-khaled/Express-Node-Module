const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../Models/Dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//CRUD for the endpoint /dishes
dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes); 
    }, (error) => next(error))
    .catch((error) => next(error));
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log(`Dish created ${dish}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish); 
    },  (error) => next(error))
    .catch((error) => next(error));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is not supported in this end point '/dishes'`);
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then((responce) => {
        console.log(`All dishes removed`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(responce);
    }, (error) => next(error))
    .catch((error) => next(error));
});

//CRUD for the endpoint /dishes/:dishID
dishRouter.route('/:dishID') 
.get((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        } 
        else {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
    }, (error) => next(error))
    .catch((error) => next(error));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported in this end point '/dishes/:${req.params.dishID}'`);
})
.put((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish != null) {
            Dishes.findByIdAndUpdate(req.params.dishID, 
            {
                $set: req.body
            },
            {
                new: true
            })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish); 
            })
        }
        else {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
    }, (error) => next(error))
    .catch((error) => next(error));
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish != null) {
            Dishes.findByIdAndDelete(req.params.dishID)
            .then(() => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish); 
            })
        }
        else {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
    }, (error) => next(error))
    .catch((error) => next(error));
});

//CRUD for the endpoint /dishes/:dishID/comments
dishRouter.route('/:dishID/comments') 
.get((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        } 
        else {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
    }, (error) => next(error))
    .catch((error) => next(error));
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish != null) {
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            }, (error) => next(error));
        } 
        else {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
    }, (error) => next(error))
    .catch((error) => next(error));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation is forbidden for the path /dishes/:${req.params.dishID}/comments`);
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish != null) {
            for(var i = 0; i < dish.comments.length; i ++) {
                dish.comments[i].remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);     
            }, (err) => next(err));
        }
        else {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
    }, (error) => next(error))
    .catch((error) => next(error));
});

//CRUD for the endpoint /dishes/:dishID/comments/:commentID
dishRouter.route('/:dishID/comments/:commentID') 
.get((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentID) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentID));
        } 
        else if(dish == null) {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
        else {
            error = new Error(`Comment ${req.params.commentID} not found`);
            error.status = 404;
            return error;
        }
    }, (error) => next(error))
    .catch((error) => next(error));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported in this end point '/dishes/:${req.params.dishID}/comments/:${req.params.commentID}'`);
})
.put((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentID) != null) {
            if(req.body.rating) {
                dish.comments.id(req.params.commentID).rating = req.body.rating; 
            }
            else if (req.body.comment) {
                dish.comments.id(req.params.commentID).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments.id(req.params.commentID));
            }, (error) => next(error));
        }
        else if(dish == null) {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
        else {
            error = new Error(`Comment ${req.params.commentID} not found`);
            error.status = 404;
            return error;
        }
    }, (error) => next(error))
    .catch((error) => next(error));
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishID)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentID) != null) {
            dish.comments.id(req.params.commentID).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            }, (error) => next(error));
        }
        else if(dish == null) {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
        else {
            error = new Error(`Dish ${req.params.dishID} not found`);
            error.status = 404;
            return error;
        }
    }, (error) => next(error))
    .catch((error) => next(error));
});


module.exports = dishRouter;
