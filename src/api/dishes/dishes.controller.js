const {Router} = require('express')
const Dish = require('../../models/dishSchema')
const asyncHandler = require("../async-handler");
const auth = require('../../middlewares/auth')
const router = new Router();
const User = require('../../models/userSchema')
const DishNotFoundException = require("../../exceptions/dish-not-found-exception")
const jwt = require('jsonwebtoken');    
const config = require('../../config');


// /api/dishes/
router.get('/test/:n?', asyncHandler(async (req, res) => {
    res.send(`${req.params.n}`)
}))

// TODO: creating new dishes
router.post('/', asyncHandler(async (req, res) => {
    const token = req.cookies.auth
    const name = req.body.name;
    const ingredients = req.body.ingredients;
    const time = req.body.times;
    const recipe = req.body.recipe;
    const likes = req.body.likes; 
    let dish;
    if(token) {
        let currentUser = jwt.verify(token, config.jwtSecret).sub;
        dish = new Dish({
            name: name,
            ingredients: ingredients,
            time: time,
            text: recipe,
            likes: likes,
            author_name: currentUser
        });
    }
    else {
         dish = new Dish({
            name: name,
            ingredients: ingredients,
            time: time,
            text: recipe,
            likes: likes
        });
    }

    await dish.save(function (err) {
        if (err) {
            console.log(err);
            res.status(400).json({
                errorMesssage: "Database error"
            })
        } else {
            res.status(200).json({status: "Przepis dodany"});
        }
    });
}))

router.delete('/:id', asyncHandler(async (req, res) => {
    const {id} = req.params;
    const dish = await Dish.findById(id);
    if(!dish) throw new DishNotFoundException();
    await dish.remove();
    res.status(204).end();
}))

router.put('/:id', asyncHandler(async (req, res) => {
    Dish.findByIdAndUpdate(req.params.id, req.body)
        .then(dish => res.json({ msg: 'Updated successfully' }))
        .catch(err =>
            res.status(400).json({ error: 'Unable to update the Database' })
        );
}));

router.get('/:n', asyncHandler(async (req, res) => {
    let result = {};
    const name = req.params.n;

    const dish = await Dish.findOne({ name: name }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            return (result);
        }
    });
    result["dish"] = dish
    // TODO: Finding author name, add to result
    // const author_name = await User.findOne({
    //     _id: dish["author_id"]
    // }, function (err, result) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         return (result["name"]);
    //     }
    // });
    // console.log(author_name.user_view())

    // result["author"] = s // dish.author_id -> name
    res.status(200).json(result);
}))



module.exports = router