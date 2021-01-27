const {Router} = require('express');
const asyncHandler = require("../async-handler");
const UnauthorizedException = require("../../exceptions/unauthorized-exception");

const Dish = require('../../models/dishSchema')

const router = new Router();

// TODO: SECURE THE THING
router.get('/dbinit', (req,res) => {
    const dish1 = new Dish({name:'zupa pomidorowa', ingredients:['pomidor','woda'], time:15, text:'pomieszaj wszytsko', likes:0});
    const dish2 = new Dish({name:'rosół', ingredients:['kurczak', 'woda'], time:10, text:'pomieszaj wszytsko', likes:0});
    const dish3 = new Dish({name:'klopsiki', ingredients:['kurczak'], time:50, text:'pomieszaj wszytsko', likes:0});
    const dish4 = new Dish({name:'lody', ingredients:['woda', 'truskawki'], time:25, text:'pomieszaj wszytsko', likes:0});
    const dish5 = new Dish({name:'tort3', ingredients:['truskawki', 'proszek'], time:30, text:'pomieszaj wszytsko', likes:0});
    dish1.save()
    dish2.save()
    dish3.save()
    dish4.save()
    dish5.save()
    res.send(`blabla`) 
})

module.exports = router