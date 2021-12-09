const ApiError = require('../error/ApiError')
const jwt = require("jsonwebtoken");
const {User, Car, Rent} = require("../models/models");
const bcrypt = require("bcrypt");
const {Op} = require("sequelize");

const generateJWT = (id,login)=>{
    return jwt.sign(
        {id: id, login},
        process.env.SECRET_KEY,
        {expiresIn: '15d'}
    )
}

class UserController{
    async login(req,res,next){
        const {login,password} = req.body
        const user  = await User.findOne({where: {login}})
        if(!user){
            return next(ApiError.badRequest('Invalid login or password'))
        }
        let comparePassword = bcrypt.compareSync(password,user.password)
        if(!comparePassword){
            return next(ApiError.badRequest('Invalid login or password'))
        }
        const token = generateJWT(user.id,user.login)
        return res.json({token})
    }
    async getUser(req,res,next){
        const {id} = req.user
        const user = await User.findOne({where:{id}})
        if(!user){
            return next(ApiError.badRequest('Invalid token or user'))
        }
        res.json(
            user.token,
            user.credits,
            user.login,
            user.name,
            user.lastname,
            user.phone,
            user.email,
        )
    }
    async getALLCars(req,res){
        let {limit,page} = req.query
        page = page || 1
        limit = limit || 10
        let offset = page*limit - limit
        let cars;
        cars = await Car.findAll({where:{limit,offset,onRequest:false}})
        return res.json(
            cars.id,
            cars.manufacturer,
            cars.model,
            cars.price,
            cars.production_year,
        )
    }
    async getBookByCarForDay(req,res){
        let {start_rent,end_rent,car_id} = req.body
        start_rent= new Date(start_rent)
        end_rent = new Date(end_rent)
        const book = await Rent.findAll(
            {attributes:['id','start_rent_time','end_rent_time'],
                where:{
                    [Op.between]:[{start_rent_time: start_rent},{start_rent_time: end_rent}],
                    car_id
                }})
        res.json(book)
    }
    async bookCar(req,res,next){
        let {car_id,start_rent_time,end_rent_time}=req.body
        const {id} = req.user
        start_rent_time = new Date(start_rent_time)
        end_rent_time = new Date(end_rent_time)
        const car = await Car.findOne({where:{car_id}})
        if(!car){
            return next(ApiError.badRequest('Invalid car_id'))
        }
        const rent = await Rent.findAll(
            {attributes:['start_rent_time','end_rent_time'],
                where:{
                    [Op.between]:[{start_rent_time: start_rent_time},{start_rent_time: end_rent_time}],
                    car_id,
                }})
        if(!rent){

        }else{
            return next(ApiError.badRequest('Car already booked'))
        }
        const dataDiff = end_rent_time - start_rent_time
        const cost = Math.round(car.cost*(dataDiff.getHours))
        const user = await User.findOne({where:{id}})
        if(!user){
            return next(ApiError.badRequest('Invalid token or user'))
        }
        if(!car_id || !start_rent_time || !end_rent_time){
            return next(ApiError.badRequest('Invalid data'))
        }
        await Rent.create(
            {
                user_id:user.id,
                car_id,
                user_token:user.token,
                start_rent_time,
                end_rent_time,
                cost,
            }
        )
    }

    async makeRequest(req,res,next){
        const {id} = req.user
        let {reason, start_rent_time, end_rent_time}=req.body
        const user = await User.findOne({where:{id}})
        start_rent_time = new Date(start_rent_time)
        end_rent_time = new Date(end_rent_time)
        if(!user){
            return next(ApiError.badRequest('Invalid token or user'))
        }
        await Request.create({
            car_id: 0,
            user_id: user.id,
            user_token: user.token,
            reason,
            start_rent_time,
            end_rent_time,
        })
    }
}
module.exports = new UserController()