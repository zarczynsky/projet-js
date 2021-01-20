const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: {type: String, unique:true, trim:true},
    ingredients: {type: Array},
    time: {type: Number},
    text: {type: String},
    likes: {type: Number},
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
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
// second try

// dishSchema.methods.user_view = function (){
//     return {
//         name: this.name,
//         ingredients: this.ingredients,
//         text: this.text,
//         time: this.time,
//         likes: this.likes
//     }
// }

let mongo = mongoose.model('Dish', dishSchema);
module.exports = mongo



