const Router = require('express')
const adminController = require("../controllers/adminController");
const router = new Router()
const authAdminMiddleware = require('../middleware/authAdminMiddleware')
const checkAdminLevelMiddleware = require('../middleware/checkAdminLevelMiddleware')

router.post('/login',adminController.login)
router.post('/register', adminController.register)
router.post('/changeUserPassword',checkAdminLevelMiddleware(1),authAdminMiddleware,adminController.changeUserPassword)
router.get('/getAllCars',authAdminMiddleware,adminController.getAllCar)
router.post('/updateUser',authAdminMiddleware,adminController.updateUser)
router.post('/changeCarUserToken',authAdminMiddleware,adminController.changeCarUserToken)
router.post('/updateCar',authAdminMiddleware,adminController.updateCar)
router.post('/carRegister',authAdminMiddleware,adminController.carRegister)
router.get('/getUser',authAdminMiddleware,adminController.getUser)
router.post('/userRegister',authAdminMiddleware,adminController.userRegister)
router.get('/getCarRequest',authAdminMiddleware,adminController.getCarRequest)
router.get('/getAllCarRequests',authAdminMiddleware,adminController.getAllCarRequests)
router.post('/acceptCarRequest',authAdminMiddleware,adminController.acceptCarRequest)
router.post('/denyCarRequest',authAdminMiddleware,adminController.denyCarRequest)
router.post('/editCarRequest',authAdminMiddleware,adminController.editCarRequest)
router.post('/editAdmin',checkAdminLevelMiddleware(1), adminController.editAdmin)
router.post('/editAdminPassword',checkAdminLevelMiddleware(1), adminController.editAdminPassword)
router.get('/getAllAdmins',checkAdminLevelMiddleware(1), adminController.getAllAdmins)
router.get('/getAdmin',checkAdminLevelMiddleware(1), adminController.getAdmin)
router.get('/getAllUsers',authAdminMiddleware,adminController.getAllUsers)
router.delete('/deleteUser',authAdminMiddleware,adminController.deleteUser)
router.delete('/deleteCar',authAdminMiddleware,adminController.deleteCar)
router.delete('/deleteAdmin',checkAdminLevelMiddleware(1),adminController.deleteAdmin)
//router.post('/editBooking',authAdminMiddleware,adminController.editBooking)
//router.post('/removeBooking',authAdminMiddleware,adminController.removeBooking)
//router.get('/viewBookingByUser',authAdminMiddleware,adminController.viewBookingByUser)
//router.get('/viewBookingByCar',authAdminMiddleware,adminController.viewBookingByCar)
//router.get('/getBooking',authAdminMiddleware,adminController.getBooking)

module.exports = router