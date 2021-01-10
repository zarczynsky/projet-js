const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

const cookieParser = require('cookie-parser')
const config = require('./config')

const Dish = require('./schema/dishSchema')
const asyncHandler = require("./api/async-handler")
const {
    sign
} = require('./services/jwt')

const User = require('./schema/userSchema')

const argon2 = require('argon2');
app.use(cookieParser(config.cookiesSecret))

const UnauthorizedException = require("./exceptions/unauthorized-exception");


const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        message: err.message || 'Error occurred'
    })
}

//import require data
// const dishRouter = require('./dish.controller');

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
    res.send('Something called rzodkiew has been requested. Sadly, there is no rzodkiew here.') // TODO: Make it a 404
})

app.get('/buraki', (req, res) => {
    res.send('Something called buraki has been requested. Sadly, there is no buraki here.')
}) // TODO: Make it a 404

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

app.post('/find/name', asyncHandler(async (req, res) => {
    const name = req.body.name;
    Dish.find({
        name: name
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });

}))

app.post('/find/ingredients', asyncHandler(async (req, res) => {
    const name = req.body.name;
    // const authHeader = req.headers.authorization;
    // if(!authHeader){
    //     throw new UnauthorizedException();
    // }
    //
    // console.log(authHeader)
    Dish.find({
        ingredients: name
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });

}))

app.post('/add', asyncHandler(async (req, res) => {
    const name = req.body.name;
    const ingredients = req.body.ingredients;
    const time = req.body.times;
    const recipe = req.body.recipe;
    const likes = req.body.likes;

    // const authHeader = req.headers.authorization;
    // if(!authHeader){
    //     throw new UnauthorizedException();
    // }
    //
    // console.log(authHeader)

    // const b64auth = authHeader.split(' ')[1] || ''
    // const [email, password] = Buffer.from(b64auth, 'base64').toString().split(':')


    const ai = new Dish({
        name: name,
        ingredients: ingredients,
        time: time,
        text: recipe,
        likes: likes
    });
    await ai.save(function (err) {
        if (err) console.log(err);


        // saved!
    });
    res.json({
        status: "Przepis dodany"
    })
}))

app.post('/createaccount', asyncHandler(async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    try {
        const hash = await argon2.hash(password);
        const user = new User({
            name: name,
            password: hash
        });
        await user.save(function (err) {
            if (err) console.log(err);
            // saved!
        });
        res.json({
            status: "Konto utworzone"
        })
    } catch (err) {
        res.json({
            status: "error"
        })
    }

}))

app.post('/login', asyncHandler(async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const hashedpassword = await User.findOne({
        name: name
    });

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
}

app.use(undefinedEndpointHandler)