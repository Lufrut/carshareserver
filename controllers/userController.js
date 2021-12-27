const ApiError = require('../error/ApiError')
const jwt = require("jsonwebtoken");
const {User, Car, Rent, Request} = require("../models/models");
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
            {
                token: user.token,
                credits: user.credits,
                login: user.login,
                name: user.name,
                lastname: user.lastname,
                phone: user.phone,
                email: user.email,
            }
        )
    }
    async getALLCars(req,res){
        let {limit,page} = req.query
        page = page || 1
        limit = limit || 10
        let offset = page*limit - limit
        let cars;
        cars = await Car.findAndCountAll({
            attributes:['id','manufacturer','model','production_year','price','onRequest'],
            where:{onRequest:false},limit,offset})
        return res.json(cars)
    }
    async getBookByCar(req,res,next){
        let {start_rent,end_rent,car_id} = req.body
        if(!start_rent || !end_rent || !car_id){
           return next(ApiError.badRequest("Invalid data"))
        }
        const car = await Car.findOne({where:{id:car_id}})
        if(!car){
            return  next(ApiError.badRequest("Car not exist"))
        }
        start_rent =  new Date(start_rent).toISOString()
        end_rent = new Date(end_rent).toISOString()
        const book = await Rent.findAll(
            {attributes:['id','start_rent_time','end_rent_time'],
                where:{
                    start_rent_time:{
                        [Op.between]:[start_rent,end_rent],
                    },
                    car_id
                }})
        res.json(book)
    }
    async bookCar(req,res,next){
        let {car_id,start_rent_time,end_rent_time}=req.body
        const {id} = req.user
        const dataDiff = Math.abs(new Date(end_rent_time) - new Date(start_rent_time))/36e5
        start_rent_time =  new Date(start_rent_time).toISOString()
        end_rent_time = new Date(end_rent_time).toISOString()
        const car = await Car.findOne({where:{id:car_id}})
        if(!car){
            return next(ApiError.badRequest('Invalid car_id'))
        }
        const rent = await Rent.findOne(
            {attributes:['start_rent_time','end_rent_time'],
                where:{
                start_rent_time:{
                    [Op.between]:[start_rent_time,end_rent_time],
                },
                    car_id,
                }})
        if(!rent){

        }else{
            return next(ApiError.badRequest('Car already booked'))
        }
        const rent_cost = Math.round(car.price*dataDiff)
        const user = await User.findOne({where:{id}})
        if(!user){
            return next(ApiError.badRequest('Invalid token or user'))
        }
        if(!car_id || !start_rent_time || !end_rent_time){
            return next(ApiError.badRequest('Invalid data'))
        }
        if (user.credits-rent_cost<0){
            return next(ApiError.badRequest('Not enough credits for book car'))
        }
        user.credits = user.credits-rent_cost;
        await User.update(
            {
                credits:user.credits,
            },
            {
                where: {id: user.id}
            })
        await Rent.create(
            {
                user_id:user.id,
                car_id,
                user_token:user.token,
                start_rent_time,
                end_rent_time,
                cost:rent_cost,
            }
        )
        return res.status(200).json("OK");
    }

    async makeRequest(req,res,next){
        const {id} = req.user
        console.log(id)
        let {reason, start_rent_time, end_rent_time}=req.body
        const user = await User.findOne({where:{id}})
        start_rent_time =  new Date(start_rent_time).toISOString()
        end_rent_time = new Date(end_rent_time).toISOString()
        if(!user){
            return next(ApiError.badRequest('Invalid token or user'))
        }
        await Request.create({
            car_id: 0,
            userId: user.id,
            user_token: user.token,
            reason,
            start_rent_time,
            end_rent_time,
        })
        return res.status(200).json("OK");
    }
}
module.exports = new UserController()