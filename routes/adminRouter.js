const Router = require('express')
const adminController = require("../controllers/adminController");
const router = new Router()
const authAdminMiddleware = require('../middleware/authAdminMiddleware')
const checkAdminLevelMiddleware = require('../middleware/checkAdminLevelMiddleware')

router.post('/login',adminController.login)
router.post('/register',checkAdminLevelMiddleware(1), adminController.register)
router.post('/changeUserPassword',authAdminMiddleware,adminController.changeUserPassword)
router.get('/getAllCars',authAdminMiddleware,adminController.getAllCar)
router.post('/changeUserPassword',authAdminMiddleware,adminController.updateUser)
router.post('/changeCarUserToken',authAdminMiddleware,adminController.changeCarUserToken)
router.post('/updateCar',authAdminMiddleware,adminController.updateCar)
router.post('/carRegister',authAdminMiddleware,adminController.carRegister)
router.post('/getUser',authAdminMiddleware,adminController.getUser)
router.post('/userRegister',authAdminMiddleware,adminController.userRegister)

module.exports = router