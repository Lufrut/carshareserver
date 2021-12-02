const ApiError = require('../error/ApiError')
const jwt = require("jsonwebtoken");
const {User} = require("../models/models");
const bcrypt = require("bcrypt");

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
    async getUser(req,res){}
    async getALLCars(req,res){}
    async bookCar(req,res){}
    async makeRequest(req,res){}
}
module.exports = new UserController()