const express = require('express')
const User = require('../models/users')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req,res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        res.send(user)
    } catch (e) {
        res.status(404).send('User not found')
    }
})

router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id,
        updates = Object.keys(req.body),
        allowedUpdates = ['name', 'email', 'password', 'age'],
        isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send('Update not allowed')
    }

    try {
        const user = await User.findById(_id)

        updates.forEach(update => user[update] = req.body[update])
        await user.save()

        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id
        console.log(_id);
        
        const user = await User.findByIdAndDelete(_id)

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router