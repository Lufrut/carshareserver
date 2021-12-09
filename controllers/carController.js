const {Car,Location} = require('../models/models')
const ApiError = require("../error/ApiError");
class carController{
    async updateCarUserToken(req,res,next){
        const {id} = req.body
        const car = await Car.findOne({where:{id}})
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
        await Location.create({
            car_id: car.id,
            location: location,
        })
        return res.status(200).json("OK");
    }
}
module.exports = new carController()