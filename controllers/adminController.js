const {Admin, User, Car} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')
const { v4: uuidv4 } = require('uuid');

const generateJWT = (id,email)=>{
    return jwt.sign(
        {id: id, email},
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
        console.log(login,admin.password)
        let comparePassword = bcrypt.compareSync(password,admin.password)
        if(!comparePassword){
            return next(ApiError.badRequest('Invalid login or password'))
        }
        const token = generateJWT(admin.id,admin.email)
        return res.json({token})
    }
    async auth(req,res){

    }
    async getAll(req,res){
        const admins = await Admin.findAll()
        return res.json(admins)
    }
    async carRegister(req,res,next) {
        const {manufacturer, model, price, production_year} = req.body
        if(!manufacturer || !model || !price || !production_year ){
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
            })
        return res.status(200).json("OK");
    }
    async getUser(req,res,next){
        const {login} = req.body
        const user = await User.findOne({where: {login}})
        if(!user){
            return next(ApiError.badRequest('Invalid login'))
        }
        return res.json(user.id,user.credits,user.name,user.lastname,user.phone,user.email)
    }
    async userRegister(req,res,next) {
        const {login,password,name,lastname,phone,email} = req.body
        if(!login || !password || !email || !name || !lastname || !phone){
            return next(ApiError.badRequest('Invalid data'))
        }
        const hash_password = await bcrypt.hash(password,5)
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

}
module.exports = new adminController()