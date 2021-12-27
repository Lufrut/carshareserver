const {Car,Location} = require('../models/models')
const ApiError = require("../error/ApiError");
class carController{
    async updateCarUserToken(req,res,next){
        const {token} = req.body
        const car = await Car.findOne({where:{token}})
        if(!car){
            return next(ApiError.badRequest('Invalid data'))
        }
        return res.json(car.user_token);
    }
    async sendLocation(req,res,next){
        const {location,token} = req.body
        const car = await Car.findOne({where:{token}})
        if(!car){
            return next(ApiError.badRequest('Invalid token'))
        }
        if(!location){
            return next(ApiError.badRequest('no location'))
        }
        const date = new Date(Date.now()).toISOString()
        await Location.create({
            carId: car.id,
            location: location,
            date: date,
        })
        return res.status(200).json("OK");
    }
}
module.exports = new carController()