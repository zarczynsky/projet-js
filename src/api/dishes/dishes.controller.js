const {Router} = require('express')
const Dish = require('../../models/dishSchema')
const asyncHandler = require("../async-handler");
const auth = require('../../middlewares/auth')
const router = new Router();
const User = require('../../models/userSchema')
const DishNotFoundException = require("../../exceptions/dish-not-found-exception")

// /api/dishes/

router.get('/test/:n?', asyncHandler(async (req, res) => {
    res.send(`${req.params.n}`)
}))

// TODO: creating new dishes
router.post('/', asyncHandler(async (req, res) => {
    const name = req.body.name;
    const ingredients = req.body.ingredients;
    const time = req.body.times;
    const recipe = req.body.recipe;
    const likes = req.body.likes;
    const id = req.body.author_id
    const token = req.cookies.auth // TODO: Throws "Cannot read property 'auth' of undefined"

    const dish = new Dish({
        name: name,
        ingredients: ingredients,
        time: time,
        text: recipe,
        likes: likes,
        author_id: id
    });

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
    const id = req.params.id;
    const dish = await Dish.findById(id);
    if(!dish) throw new DishNotFoundException();
}))

router.put('/:id', asyncHandler(req, res) => {
    Dish.findByIdAndUpdate(req.params.id, req.body)
        .then(dish => res.json({ msg: 'Updated successfully' }))
        .catch(err =>
            res.status(400).json({ error: 'Unable to update the Database' })
        );
});

router.get('/:n', asyncHandler(async (req, res) => {
    let result = {};
    const name = req.params.n;

    const dish = await Dish.findOne({
        name: name
    }, function (err, result) {
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

// router.post('/find/ingredients', auth({
//     required: true
// }), asyncHandler(async (req, res) => {
//     const reqIngredients = req.body.ingredients;
//     Dish.find({
//         ingredients: reqIngredients
//     }, function (err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(result);
//         }
//     });

// REMOVE
// router.post('/find/name/:n', asyncHandler(async (req, res) => {
//     const name = req.body.name;
//     //name = req.params.n;
//     const dish = await Dish.findOne({
//         name: name
//     }, function (err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             return (result);
//         }
//     });

//     const author_name = await User.findOne({
//         _id: dish["author_id"]
//     }, function (err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             return (result["name"]);
//         }
//     });

//     console.log(author_name.user_view())
//     let result = {};
//     result["author"] = author_name["name"];
//     result["dish"] = dish

//     res.json(result);
// }))

// }))


module.exports = router