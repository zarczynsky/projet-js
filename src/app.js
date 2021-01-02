const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const Dish = require('../db/Schema')
const asyncHandler = require("../db/async-handler");

//import require data
const dishRouter = require('./dish.controller');

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



// const express = require('express')
// const app = express()

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(
        {
            message: err.message || 'Error occurred'
        }
    )
}

// Dish.find({ 'name': 'Ale5sss5' }, 'name age', function (err, athletes) {
//     if (err) return errorHandler(err);
//     // 'athletes' contains the list of athletes that match the criteria.
// })
//
// const ai = new Dish({name:'Ale5sss5'});
// ai.save(function (err) {
//     if (err) return errorHandler(err);
//     // saved!
// });

// POST /api/dish
app.post('/dish', asyncHandler(async (req, res) => {
    const body = req.body;
    const dish = await Dish.create(body);
    res.json(dish.view());
}))

// app.get('/show', (req,res) => {
//     const query = Dish.findOne({ name: 'Ale5sss5'},  function (err, athletes) {
//         if (err) console.log(err);
//         // 'athletes' contains the list of athletes that match the criteria.
//     })
//     console.log(typeof query)
//     res.json(query.user_view())
// })

app.route("/find").get(function(req, res) {
    Dish.find({ name: 'Ale5sss5' }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});



