
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token

    if (authHeader) {
        const token = authHeader.split(" ")[1]
        console.log(token)
        jwt.verify(token, process.env.SECRET, (err, user) => {

            if (err) {
                res.status(401).json("Token is not valid")
            }
            req.user = user
            next()
        })
    } else {
        return res.status(401).json("you are not authentication")
    }
}

const verifyTokenAndAuthorrization = (req, res, next) => {

    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("you are not alowed to do that!")
        }
    })
}


const verifyTokenAndAdmin = (req, res, next) => {

    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("you are not alowed to do that!")
        }
    })
}



module.exports = { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorrization }