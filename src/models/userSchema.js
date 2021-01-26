const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, unique:true, required:true},
    password: {type: String, required:true},
});

let mongo = mongoose.model('User', userSchema);
module.exports = mongo
