const express = require('express')
require('./db/mongoose')
const User = require('./models/users'),
    Task = require('./models/tasks')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.status(201).send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/users', (req,res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send()
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id
    User.findById(_id).then((user) => {
        res.send(user)
    }).catch((e) => {
        res.status(404).send('User not found')
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/tasks', (req,res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

app.get('/tasks/:id', (req,res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        res.send(task)
    }).catch((e) => {
        res.status(404).send('Task not found')
    })
})

app.listen(PORT, ()=> {
    console.log(`Server is up on port ${PORT}`)
})