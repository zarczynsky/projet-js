const jwt = require('jsonwebtoken');
const config = require('../config')

const sign = (id) =>
    jwt.sign({
        sub: id
    }, config.jwtSecret, {
        expiresIn: '1 day'
    }) // lub w sekundach


// const sign = (id, role) =>
//     jwt.sign({
//         sub: id,
//         role
//     }, config.jwtSecret, {
//         expiresIn: '1 day'
//     }) // lub w sekundach

module.exports = {
    sign
}