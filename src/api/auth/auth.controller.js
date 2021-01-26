const {Router} = require('express');
const asyncHandler = require("../async-handler");
const User = require("../../models/userSchema");
const config = require('../../config');
const UnauthorizedException = require("../../exceptions/unauthorized-exception");
const {sign} = require('../../services/jwt')
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');   

const router = new Router();

// POST /api/auth
// router.post('/', asyncHandler(async (req, res) => {
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         throw new UnauthorizedException();
//     }

//     const b64auth = authHeader.split(' ')[1] || ''
//     const [email, password] = Buffer.from(b64auth, 'base64').toString().split(':')

//     const user = await User.findOne({ email });

//     if(!user) return res.status(401).end();

//     if(await user.authenticate(password)){
//         const token = sign(user._id, user.role);
//         res.cookie('auth', token, config.cookiesOptions)
//         return res.send(user.view())
//     }

//     return res.status(401).end();
// }))

module.exports = () => (req, res, next) => {
    const token = req.cookies.auth
    if (!token) throw new UnauthorizedException();
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, config.jwtSecret);
    } catch {
        throw new UnauthorizedException('Wrong token');
    }

    const user = {
        _id: decodedToken.sub,
        // role: decodedToken.role
    }

    // if ((required && !user) || (required && !~roles.indexOf(user.role))) {
    //     throw new UnauthorizedException();
    // }

    req.user = user;
    next();
};

module.exports = router