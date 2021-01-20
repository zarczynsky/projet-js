const express = require('express')
const app = express()
const port = 3000
const NotFoundException = require('./exceptions/not-found-exception')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

const cookieParser = require('cookie-parser')
const config = require('./config')
const jwt = require('jsonwebtoken');
const auth = require('./middlewares/auth')

const Dish = require('./schema/dishSchema')
const asyncHandler = require("./api/async-handler")
const {
    sign
} = require('./services/jwt')

const User = require('./schema/userSchema')

const argon2 = require('argon2');
app.use(cookieParser(config.cookiesSecret))


const UnauthorizedException = require("./exceptions/unauthorized-exception");

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

app.get('/', (req, res) => {
    res.send('Hello, Mr. World!')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

app.get('/rzodkiew', (req, res) => {
    res.send(`
    <center>It's-a-me, rzodkiewko!<br/><img src="https://www.rynek-rolny.pl/images/articles/560/67c46c78378b9f058d70895ce23a6158-carmesa.jpg"/></center>`) // TODO: Make it a 404
})

app.get('/burak', (req, res) => {
    res.send('<center>Something called buraki has been requested. Sadly, there is no buraki here.<br/>Here\'s a burak for you:<br/><img src="https://lh3.googleusercontent.com/proxy/JxHBQ-nSu-el-GHlZ5XwSkOg71O76BSzvVlqWnX2Itwq8SPsBwkbUem7fAyi6wQYQqYMwHPF5ee0qSJuhiFKrcLS0r4zOG6khLPGn7dOQKhTWQ"/></center>')
})

/*
const dish1 = new Dish({name:'zupa pomidorowa', ingredients:['pomidor','woda'], time:15, text:'pomieszaj wszytsko', likes:0});
const dish2 = new Dish({name:'rosół', ingredients:['kurczak', 'woda'], time:10, text:'pomieszaj wszytsko', likes:0});
const dish3 = new Dish({name:'klopsiki', ingredients:['kurczak'], time:50, text:'pomieszaj wszytsko', likes:0});
const dish4 = new Dish({name:'lody', ingredients:['woda', 'truskawki'], time:25, text:'pomieszaj wszytsko', likes:0});
const dish5 = new Dish({name:'tort', ingredients:['truskawki', 'proszek'], time:30, text:'pomieszaj wszytsko', likes:0});
*/


app.post('/dish/find/name/:n', asyncHandler(async (req, res) => {
    const name = req.body.name;
    //name = req.params.n;
    const dish = await Dish.findOne({ name: name }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            return(result);
        }
    });

    const author_name = await User.findOne({ _id: dish["author_id"] }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            return(result["name"]);
        }
    });

    console.log(author_name.user_view())
    let result = {};
    result["author"] = author_name["name"];
    result["dish"] = dish

    res.json(result);
}))

app.post('/dish/find/ingredients',auth({ required: true}) ,asyncHandler(async (req, res) => {
    const reqIngredients = req.body.ingredients;
    Dish.find({ ingredients: reqIngredients }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}))


app.post('/dish', asyncHandler(async (req, res) => {
    const name=req.body.name;
    const ingredients=req.body.ingredients;
    const time=req.body.times;
    const recipe=req.body.recipe;
    const likes=req.body.likes;
    const id = req.body.author_id

    const token = req.cookies.auth

    const ai = new Dish({name: name, ingredients: ingredients, time: time, text: recipe, likes:likes,
        author_id: id});
    await ai.save(function (err) {
    if (err) {console.log(err);
        res.json({status: "Błąd bazy"})}
    else{
        res.json({status: "Przepis dodany"});
    }
});

}))


app.post('/user', asyncHandler(async (req, res) => {
    const name=req.body.name;
    const password=req.body.password;
    try {
        const hash = await argon2.hash(password);
        const user = new User({
            name: name,
            password: hash
        });
        await user.save(function (err) {
            if (err) {console.log(err);
            res.json({status: "Błąd bazy"});}
            else {
                res.json({status: "Konto utworzone"})
            }
        });
    } catch (err) {
        res.json({
            status: "error"
        })
    }

}))


app.post('/user/token', asyncHandler(async (req, res) => {
    const name=req.body.name;
    const password=req.body.password;
    const hashedpassword = await User.findOne({name: name});

    try {
        if (await argon2.verify(hashedpassword['password'], password)) {

            const token = sign(name);
            res.cookie('auth', token, config.cookiesOptions)

            return res.json({
                status: "log in"
            })
        } else {
            res.json({
                status: "bad password"
            })
        }
    } catch (err) {
        res.json({
            status: "no user"
        })
    }
}))

const undefinedEndpointHandler = (req, res) => {
    
    res.status(404).send({
        error: 'Undefined Endpoint'
    })
    throw new NotFoundException()
}

app.use(errorHandler)
app.use(undefinedEndpointHandler)
