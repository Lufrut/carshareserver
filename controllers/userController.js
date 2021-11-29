const ApiError = require('../error/ApiError')
class UserController{
    async login(req,res){

    }
    async auth(req,res,next){
        const {login, password} = req.query
        if(!login||!password){
            return next(ApiError.badRequest('Invalid login or password'))
        }
    }
}
module.exports = new UserController()