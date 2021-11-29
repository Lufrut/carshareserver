const jwt = require('jsonwebtoken')

module.exports = function (level) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                res.status(401).json({message: "Not authorized!"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (decoded.level !== level) {
                res.status(401).json({message: "You haven't permission to do that."})
            }
            req.user = decoded
            next()
        } catch (e) {
            res.status(401).json({message: "You haven't permission to do that"})
        }
    }
}