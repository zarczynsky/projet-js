const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const dishSchema = new mongoose.Schema({
    name: {type: String, unique:true},
//    some_id: {type: ObjectId},
    ingredients: {type: Array},
    time: {type: Number}
});

const userSchema = new mongoose.Schema({
    name: {type: String, unique:true, required:true},
//    some_id: {type: ObjectId},
    password: {type: String, required:true},
});