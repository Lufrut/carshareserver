const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authUserMiddleware = require('../middleware/authUserMiddleware')

router.get('/getUser',authUserMiddleware,userController.getUser)
router.get('/getAllCars',authUserMiddleware,userController.getALLCars)
router.post('/bookCar',authUserMiddleware,userController.bookCar)
router.post('/login',userController.login)
router.post('/makeRequest',authUserMiddleware,userController.makeRequest)
router.post('/getBookByCar',authUserMiddleware,userController.getBookByCar)

module.exports = router