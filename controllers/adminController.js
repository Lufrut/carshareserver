const {Admin, User, Car, Request, Rent} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')
const { v4: uuidv4 } = require('uuid');
const {Op} = require("sequelize");

const generateJWT = (id,email,level)=>{
    return jwt.sign(
        {id: id, email, level},
        process.env.SECRET_KEY,
        {expiresIn: '15d'}
    )
}
class adminController{

    async login(req,res,next){
        const {login,password} = req.body
        const admin  = await Admin.findOne({where: {login}})
        if(!admin){
            return next(ApiError.badRequest('Invalid login or password'))
        }
        let comparePassword = bcrypt.compareSync(password,admin.password)
        if(!comparePassword){
            return next(ApiError.badRequest('Invalid login or password'))
        }
        const token = generateJWT(admin.id,admin.email,admin.level)
        return res.json({token})
    }
    async changeUserPassword(req,res,next){
        const {id,password} = req.body
        const hash_password = await bcrypt.hash(password,5)
        const idCheck = await User.findOne({where: {
                id:id
            }})
        if(!idCheck){
            return next(ApiError.badRequest("User not exist!"))
        }
        await User.update(
            {
               password:hash_password
            },
            {
                where: {id: id}
            })
        return res.status(200).json("OK");
    }
    async getAllCar(req,res){
        let {limit,page} = req.query
        page = page || 1
        limit = limit || 10
        let offset = page*limit - limit
        let cars;
        cars = await Car.findAndCountAll({
            attributes:['id','manufacturer','model','production_year','price','onRequest'],
            where:{},limit,offset})
        return res.json(cars)
    }
    async updateUser(req,res,next){
        const {id,login,name,lastname,phone,email,credits} = req.body
        if(!login  || !email || !name || !lastname || !phone ||!credits){
            return next(ApiError.badRequest('Invalid data'))
        }
        const idCheck = User.findOne({where: {
                id:id
            }})
        if(!idCheck){
            return next(ApiError.badRequest(idCheck))
        }
        await User.update(
            {
                credits,
                login,
                name,
                lastname,
                phone,
                email,
            },
            {
                where: {id: id}
            })
        return res.status(200).json("OK");

    }
    async changeCarUserToken(req,res,next){
        const {id,user_token} = req.body
        if(!id||!user_token){
            return next(ApiError.badRequest('Invalid data'))
        }
        await Car.update(
            {user_token},
            {
                where: {id: id}
            })
        return res.status(200).json("OK");
    }
    async updateCar(req,res,next){
        const {id,manufacturer, model, price, production_year} = req.body
        if(!id||!manufacturer || !model || !price || !production_year ){
            return next(ApiError.badRequest('Invalid data'))
        }
        await Car.update(
            {
                manufacturer,
                model,
                price,
                production_year,
            },
            {
                where: {id}
            })
        return res.status(200).json("OK");
    }
    async carRegister(req,res,next) {
        const {manufacturer, model, price, production_year, onRequest} = req.body
        if(!manufacturer || !model || !price || !production_year || !onRequest ){
            return next(ApiError.badRequest('Invalid data'))
        }
        const token = uuidv4()
        const  user_token = process.env.DEFAULT_TOKEN
        await Car.create(
            {
                manufacturer,
                model,
                token,
                user_token,
                price,
                production_year,
                onRequest,
            })
        return res.status(200).json("OK");
    }
    async getUser(req,res,next){
        const {login} = req.body
        const user = await User.findOne({
            attributes:[
                'id',
                'token',
                'credits',
                'login',
                'name',
                'lastname',
                'phone',
                'email',
            ],
            where: {login}
        })
        if(!user){
            return next(ApiError.badRequest('Invalid login'))
        }
        return res.json(user)
    }
    async userRegister(req,res,next) {
        const {login,password,name,lastname,phone,email} = req.body
        if(!login || !password || !email || !name || !lastname || !phone){
            return next(ApiError.badRequest('Invalid data'))
        }
        const hash_password = await bcrypt.hash(password,5)
        let check;
        const login_is_Exist = await User.findOne({where: {
                login: login
            }})
        const email_is_Exist = await User.findOne({where: {
                email: email
            }})
        if(email_is_Exist){
            check = 'User with this email already exists'
        }
        else if(login_is_Exist){
            check =  'User with this login already exists'
        }
        else{
            check = true
        }
        if(check!==true){
            return next(ApiError.badRequest(check))
        }
        const token = uuidv4()
        const credits = 0;
        await User.create(
            {
                token,
                credits,
                login,
                password: hash_password,
                name,
                lastname,
                phone,
                email,
            })
        return res.status(200).json("OK");
    }

    async register(req,res,next) {
        const {login,password,email,level} = req.body
        if(!login || !password || !email || !level){
            console.log(login,password,email,level)
            return next(ApiError.badRequest('Invalid data'))
        }
        const hash_password = await bcrypt.hash(password,5)
        console.log(hash_password)
        const login_is_Exist = await Admin.findOne({where: {
                login: login
            }})
        const email_is_Exist = await Admin.findOne({where: {
                email: email
            }})
        if(email_is_Exist){
            return next(ApiError.badRequest('User with this email already exists'))
        }
        if(login_is_Exist){
            return next(ApiError.badRequest('User with this login already exists'))
        }
        await Admin.create(
            {
                login,
                password: hash_password,
                email,
                level
            })
        return res.status(200).json("OK");
    }
    async getCarRequest(req,res,next){
        const {id} = req.body
        if(!id){
            return next(ApiError.badRequest('Wrong request id!'))
        }
        const request = await Request.findOne({where:{id:id}})
        if(!request){
            return next(ApiError.badRequest('Wrong request id!'))
        }
        return res.json(request)
    }
    async getAllCarRequests(req,res){
        let {limit,page} = req.query
        page = page || 1
        limit = limit || 10
        let offset = page*limit - limit
        let request;
        request = await Request.findAndCountAll({where:{},limit,offset})
        return res.json(request)
    }
    async acceptCarRequest(req,res,next){
        let {car_id,request_id}=req.body
        const request = await Request.findOne({where:{id:request_id}})
        if(!car_id || !request || !request_id){
            return next(ApiError.badRequest('Invalid data'))
        }
        let start_rent_time = new Date(request.start_rent_time)
        let end_rent_time = new Date(request.end_rent_time)
        const car = await Car.findOne({where:{id:car_id}})
        if(!car){
            return next(ApiError.badRequest('Invalid car_id'))
        }
        await Rent.destroy(
            {
                where:{
                    start_rent_time:{
                        [Op.between]:[start_rent_time,end_rent_time],
                    },
                    car_id,
                }})
        const user = await User.findOne({where:{id:request.userId}})
        if(!user){
            return next(ApiError.badRequest('Invalid token or user'))
        }

        await Rent.create(
            {
                user_id:user.id,
                car_id,
                user_token:user.token,
                start_rent_time,
                end_rent_time,
                cost:0,
            }
        )
        return res.status(200).json("OK");
    }
    async denyCarRequest(req,res,next){
        const {id} = req.body
        const request = await Request.findOne({where: {id}})
        if(!request){
            return next(ApiError.badRequest("invalid request id"))
        }
        await Request.destroy({where: {id}})
        return res.status(200).json("OK");
    }
    async editCarRequest(req,res,next){
        let {id, car_id, user_id, reason, start_rent_time, end_rent_time} = req.body
        if(!id || !car_id || !user_id || !reason || !start_rent_time || !end_rent_time){
            return next(ApiError.badRequest('Wrong data!'))
        }
        const request = await Request.findOne({where: {id}})
        const user = await  User.findOne({where: {id:user_id}})
        start_rent_time = new Date(start_rent_time)
        end_rent_time = new Date(end_rent_time)
        if(!request){
            return next(ApiError.badRequest('Wrong request id!'))
        }
        if(!user){
            return next(ApiError.badRequest('Wrong user_id!'))
        }
        const user_token = user.token
        await Request.update(
            {
                car_id,
                user_id,
                user_token,
                reason,
                start_rent_time,
                end_rent_time,
            },
            {
                where: {id}
            })
        return res.status(200).json("OK");
    }
    async editAdmin(req,res,next){
        const {id, login, email, level} = req.body
        if(!id || !login || !email || !level){
            return next(ApiError.badRequest('Wrong data!'))
        }
        const admin = await Admin.findOne({where: {id}})
        if(!admin){
            return next(ApiError.badRequest('Wrong admin id!'))
        }
        await Admin.update(
            {
                login,
                email,
                level,
            },
            {
                where: {id}
            })
        return res.status(200).json("OK");
    }
    async editAdminPassword(req,res,next){
        const {id,password} = req.body
        const hash_password = await bcrypt.hash(password,5)
        const admin = await  Admin.findOne({where:{id}})
        if(!admin){
            return next(ApiError.badRequest("Admin with this id not exist"))
        }
        await Admin.update(
            {
                password:hash_password
            },
            {
                where: {id: id}
            })
        return res.status(200).json("OK");
    }
    async getAllAdmins(req,res){
        let {limit,page} = req.query
        page = page || 1
        limit = limit || 10
        let offset = page*limit - limit
        let admin;
        admin = await Admin.findAndCountAll({
            attributes:['id','login','email','level'],
            where:{},
            limit,
            offset
        })
        return res.json(admin)
    }
    async getAdmin(req,res){
        const {id} = req.body
        const admin = Admin.findOne({where:{id}})
        return res.json(admin)
    }
    async getAllUsers(req,res){
        let {limit,page} = req.query
        page = page || 1
        limit = limit || 10
        let offset = page*limit - limit
        let user;
        user = await User.findAndCountAll({where:{},limit,offset})
        return res.json(user)
    }
    async deleteUser(req,res,next){
        const {id} = req.query
        if(!id){
            return next(ApiError.badRequest("Wrong id"))
        }
        const user = await User.findOne({where:{id:id}})
        if(!user)
        {
            return next(ApiError.badRequest("User does not exist"))
        }
        await User.destroy({where:{id:id}})
        return res.status(200).json("OK");
    }
    async deleteCar(req,res,next){
        const {id} = req.query
        if(!id){
            return next(ApiError.badRequest("Wrong id"))
        }
        const car = await Car.findOne({where:{id:id}})
        if(!car)
        {
            return next(ApiError.badRequest("Car does not exist"))
        }
        await Car.destroy({where:{id:id}})
        return res.status(200).json("OK");
    }
    async deleteAdmin(req,res,next){
        const {id} = req.query
        if(!id){
            return next(ApiError.badRequest("Wrong id"))
        }
        const admin = await Admin.findOne({where:{id:id}})
        if(!admin)
        {
            return next(ApiError.badRequest("Admin does not exist"))
        }
        await Admin.destroy({where:{id:id}})
        return res.status(200).json("OK");
    }
    /* async editBooking(req,res){
    }
    async removeBooking(req,res){}
    async viewBookingByUser(req,res){}
    async viewBookingByCar(req,res){}
    async getBooking(req,res){}
    */
}
module.exports = new adminController()