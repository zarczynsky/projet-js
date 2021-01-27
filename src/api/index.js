const {Router} = require('express')
const dishesRouter = require('./dishes/dishes.controller')
const usersRouter = require('./users/users.controller')
const asyncHandler = require("./async-handler")
const authRouter = require("./auth/auth.controller")
const adminRouter = require("./admin/admin.controller")
const router = new Router()

router.use('/dishes', dishesRouter)
router.use('/users', usersRouter) 
router.use('/admin', adminRouter)

router.get('/rzodkiew', asyncHandler(async (req, res) => {
    res.send(`
    <center>It's-a-me, rzodkiewko!<br/><img src="https://www.rynek-rolny.pl/images/articles/560/67c46c78378b9f058d70895ce23a6158-carmesa.jpg"/></center>`) // TODO: Make it a 404
}))
  

module.exports = router