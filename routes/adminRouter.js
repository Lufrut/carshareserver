const Router = require('express')
const adminController = require("../controllers/adminController");
const router = new Router()
const authAdminMiddleware = require('../middleware/authAdminMiddleware')

router.post('/login',adminController.login)
router.post('/register',authAdminMiddleware, adminController.register)
router.get('/auth',authAdminMiddleware, adminController.auth)
router.get('/getAll',adminController.getAll)

module.exports = router