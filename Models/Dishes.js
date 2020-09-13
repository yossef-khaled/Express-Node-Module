const mongoose = require('mongoose');
const schema = mongoose.Schema;

const commentSchema = new schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true  
    }
},{
    timestamps: true
});

const disheSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [commentSchema]
},
{
    timestamps: true    
});

var Dishes = mongoose.model('Dish', disheSchema);

module.exports = Dishes;