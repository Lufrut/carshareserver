const Router = require('express')
const carController = require('../controllers/carController')
const router = new Router()

router.get('/updateCarUserToken',carController.updateCarUserToken)
router.post('/sendLocation',carController.sendLocation)

module.exports = router