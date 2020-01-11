const express = require('express')
const Task = require('../models/tasks')

const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req,res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', async (req,res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById(_id)
        res.send(task)
    } catch (e) {
        res.status(404).send('Task not found')
    }
})

router.patch('/tasks/:id', async (req, res) => {
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

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        res.send(task)
    } catch (e) {
        res.status(404).send('Task not found')
    }
})

module.exports = router