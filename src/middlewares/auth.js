const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../model/userSchema');
const UnauthorizedException = require("../exceptions/unauthorized-exception");


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