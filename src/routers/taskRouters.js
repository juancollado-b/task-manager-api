const express = require('express')
const auth = require('../middlewares/auth')
const Task = require('../models/tasks')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET: /tasks?completed=true
router.get('/tasks', auth, async (req,res) => {
    const match = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    try {
      await req.user.populate({
          path: 'tasks',
          match
      }).execPopulate()
      res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if (!task) {
          return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id,
        updates = Object.keys(req.body),
        allowedUpdates = ['description', 'completed'],
        isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({error: 'Update not allowed'})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
          return status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch(e) {
        res.status(400).send({e})
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {

      const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

      if (!task) {
        res.status(404).send({error: 'Task not found'})
      }

      task.remove()

      res.send({message: 'Task remove succesfully'})
    } catch (e) {
      res.status(404).send('Task not found')
    }
})

module.exports = router
