const Router = require('express')
const router = new Router()
const adminRouter = require('./adminRouter')
const carRouter = require('./carRouter')
const userRouter = require('./userRouter')

router.use('/user',userRouter)
router.use('/admin',adminRouter)
router.use('/car',carRouter)

module.exports = router