const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: {type: String, unique:true},
    ingredients: {type: Array},
    time: {type: Number},
    text: {type: String},
    likes: {type: Number}
});

dishSchema.methods = {
    user_view() {
        return {
            name: this.name,
            ingredients: this.ingredients,
            text: this.text,
            time: this.time,
            likes: this.likes
        }
    }
}

dishSchema.methods.user_view = function (){
    return {
        name: this.name,
        ingredients: this.ingredients,
        text: this.text,
        time: this.time,
        likes: this.likes
    }
}

//dishSchema.methods.findSimilarTypes = function(cb) {
//    return mongoose.model('Animal').find({ name: this.name }, cb);
//};

let mongo = mongoose.model('Dish', dishSchema);
module.exports = mongo



