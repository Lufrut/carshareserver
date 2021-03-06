const jwt = require('jsonwebtoken')
const {Admin} = require("../models/models");

module.exports = function (req,res,next) {
    if (req.method ==="OPTIONS"){
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            res.status(401).json({message: "Not authorized!"})
        }
        req.user = jwt.verify(token,process.env.SECRET_KEY)
        const {id} = req.user
        const admin = Admin.findOne({where:{id}})
        if(!admin){
            res.status(401).json({message: "Not authorized!"})
        }
        next()
    }
    catch (e){
        res.status(401).json({message: "Not authorized!"})
    }
}