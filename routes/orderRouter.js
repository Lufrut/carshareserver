const Router = require('express')
const orderController = require("../controllers/orderController");
const router = new Router()

router.get('/auth',orderController.auth)

module.exports = router