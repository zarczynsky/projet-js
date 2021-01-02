const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const Dish = require('./schema/dishSchema')
const User=require('./schema/userSchema')
const asyncHandler = require("../db/async-handler");

//import require data
// const dishRouter = require('./dish.controller');

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', (req, res) => {
  res.send('Hello, Mr. World!')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

app.get('/rzodkiew', (req,res) => {
    res.send('Something called rzodkiew has been requested. Sadly, there is no rzodkiew here.') // TODO: Make it a 404
})

app.get('/buraki', (req,res) => {
    res.send('Something called buraki has been requested. Sadly, there is no buraki here.')
})// TODO: Make it a 404


// const ai = new Dish({name:'Ale5sss5'});
// ai.save(function (err) {
//     if (err) return errorHandler(err);
//     // saved!
// });



/*
const dish1 = new Dish({name:'zupa pomidorowa', ingredients:['pomidor','woda'], time:15, text:'pomieszaj wszytsko', likes:0});
const dish2 = new Dish({name:'rosół', ingredients:['kurczak', 'woda'], time:10, text:'pomieszaj wszytsko', likes:0});
const dish3 = new Dish({name:'klopsiki', ingredients:['kurczak'], time:50, text:'pomieszaj wszytsko', likes:0});
const dish4 = new Dish({name:'lody', ingredients:['woda', 'truskawki'], time:25, text:'pomieszaj wszytsko', likes:0});
const dish5 = new Dish({name:'tort', ingredients:['truskawki', 'proszek'], time:30, text:'pomieszaj wszytsko', likes:0});
*/

app.route("/find/name").get(function(req, res) {
    Dish.find({ name: 'tort' }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});

app.route("/find/ingredients").get(function(req, res) {
    Dish.find({ ingredients: 'woda' }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});


app.post('/find/name', asyncHandler(async (req, res) => {
    const name = req.body.name;
    Dish.find({ name: name }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });

}))

app.post('/find/ingredients', asyncHandler(async (req, res) => {
    const name = req.body.name;
    Dish.find({ ingredients: name }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });

}))



