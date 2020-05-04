const jwt = require('jsonwebtoken'),
    { ObjectId} = require('mongoose').Types,
    User = require('../../src/models/users'),
    Task = require('../../src/models/tasks')

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

const userTwoId = new ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Martina',
    age: 18,
    email: 'martina@email.com',
    password: 'martina123@',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_TOKEN)
    }]  
}

const taskOneId = new ObjectId()
const taskOne = {
    _id: taskOneId,
    description: 'First task',
    owner: userOneId
}

const taskTwoId = new ObjectId()
const taskTwo = {
    _id: taskTwoId,
    description: 'Second task',
    owner: userOneId
}

const taskThirdId = new ObjectId()
const taskThird = {
    _id: taskThirdId,
    description: 'Third task',
    owner: userTwoId
}

const setUpDataBase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThird).save()
}

module.exports = {
    userOneId,
    userOne,
    setUpDataBase,
    taskOneId,
    userTwo
}