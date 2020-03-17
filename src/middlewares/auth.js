const jwt = require("jsonwebtoken"),
    User = require("../models/users")

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'mySecretKey')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: 'Please Authenticate.'})
    }
}

module.exports = auth