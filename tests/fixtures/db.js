const jwt = require('jsonwebtoken'),
    { ObjectId} = require('mongoose').Types,
    User = require('../../src/models/users')
    
const userOneId = new ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Juan',
    age: 18,
    email: 'juan@email.com',
    password: 'hello123!$',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_TOKEN)
    }]  
}

const setUpDataBase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    setUpDataBase
}