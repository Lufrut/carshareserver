const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')

router.get('/getUser',userController.getUser)
router.get('/getUser',userController.getALLCars)
router.post('/bookCar',userController.bookCar)
router.post('/login',userController.login)
router.post('/makeRequest',userController.makeRequest)

module.exports = router