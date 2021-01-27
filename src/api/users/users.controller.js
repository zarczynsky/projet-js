const {Router} = require('express');
const asyncHandler = require("../async-handler");
const User = require("../../models/userSchema");
const argon2 = require('argon2');
const config = require('../../config');
// const EmailTakenException = require("../../exceptions/email-taken-exception");
const {sign} = require('../../services/jwt')
const jwt = require('jsonwebtoken');    

const router = new Router();

// POST /api/users
router.post('/', asyncHandler(async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    try {
        const hash = await argon2.hash(password);
        const user = new User({
            name: name,
            password: hash
        });
        await user.save(function (err) {
            if (err) {
                console.log(err);
                res.json({
                    status: "Błąd bazy"
                });
            } else {
                res.json({
                    status: "Konto utworzone"
                })
            }
        });
    } catch (err) {
        res.json({
            status: "error"
        })
    }
}))

router.post('/sign-in', asyncHandler(async (req, res) => {
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
        console.log(err.stack);
        res.json({
            status: "no user"
        })
    }
}))

router.get('/', (req, res) => {
    const token = req.cookies.auth
    if(token) {
        let decodedToken = jwt.verify(token, config.jwtSecret);
        res.json({currentUser: decodedToken.sub})
    }
    else {
        res.json({status: "User not signed-in"})
    }
}); 

module.exports = router