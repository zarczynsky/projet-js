const {Router} = require('express')
const Dish = require('../../models/dishSchema')
const asyncHandler = require("../async-handler");
const auth = require('../../middlewares/auth')
const router = new Router();

router.get('/route-test/:n?', asyncHandler(async (req, res) => {
    res.send(`${req.params.n}`)
}))

router.post('/', asyncHandler(async (req, res) => {
    const name = req.body.name;
    const ingredients = req.body.ingredients;
    const time = req.body.times;
    const recipe = req.body.recipe;
    const likes = req.body.likes;
    const id = req.body.author_id

    const token = req.cookies.auth // TODO: Throws "Cannot read property 'auth' of undefined" 

    const ai = new Dish({
        name: name,
        ingredients: ingredients,
        time: time,
        text: recipe,
        likes: likes,
        author_id: id
    });
    await ai.save(function (err) {
        if (err) {
            console.log(err);
            res.status(418).json({
                status: "Błąd bazyy"
            })
        } else {
            res.json({
                status: "Przepis dodany"
            });
        }
    });

}))

router.get('/find/name', asyncHandler(async (req, res) => {
    const name = req.body.name;
    //name = req.params.n;
    const dish = await Dish.findOne({
        name: name
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            return (result);
        }
    });

    const author_name = await User.findOne({
        _id: dish["author_id"]
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            return (result["name"]);
        }
    });

    console.log(author_name.user_view())
    let result = {};
    result["author"] = author_name["name"];
    result["dish"] = dish

    res.json(result);
}))



router.post('/find/name/:n', asyncHandler(async (req, res) => {
    const name = req.body.name;
    //name = req.params.n;
    const dish = await Dish.findOne({
        name: name
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            return (result);
        }
    });

    const author_name = await User.findOne({
        _id: dish["author_id"]
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            return (result["name"]);
        }
    });

    console.log(author_name.user_view())
    let result = {};
    result["author"] = author_name["name"];
    result["dish"] = dish

    res.json(result);
}))

router.post('/find/ingredients', auth({
    required: true
}), asyncHandler(async (req, res) => {
    const reqIngredients = req.body.ingredients;
    Dish.find({
        ingredients: reqIngredients
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}))


module.exports = router