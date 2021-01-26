const {Router} = require('express');
const asyncHandler = require("../async-handler");
const User = require("../../models/userSchema");
// const config = require('../../../config');
// const EmailTakenException = require("../../exceptions/email-taken-exception");
// const {sign} = require('../../services/jwt')
// const auth = require('../../middlewares/auth')

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


router.post('/token', asyncHandler(async (req, res) => {
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

module.exports = router