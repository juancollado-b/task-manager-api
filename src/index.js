const express = require('express')
require('./db/mongoose')
const User = require('./models/users'),
    Task = require('./models/tasks')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/users', async (req,res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        res.send(user)
    } catch (e) {
        res.status(404).send('User not found')
    }
})

app.patch('/users/:id', async (req, res) => {
    const _id = req.params.id,
        updates = Object.keys(req.body),
        allowedUpdates = ['name', 'email', 'password', 'age'],
        isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send('Update not allowed')
    }

    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})

        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

app.get('/tasks', async (req,res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.get('/tasks/:id', async (req,res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        res.send(task)
    } catch (e) {
        res.status(404).send('Task not found')
    }
})

app.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id,
        updates = Object.keys(req.body),
        allowedUpdates = ['description', 'completed'],
        isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send('Update not allowed')
    }

    try {
        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true})

        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

app.listen(PORT, ()=> {
    console.log(`Server is up on port ${PORT}`)
})