const express = require('express'),
    User = require('../models/users'),
    auth = require('../middlewares/auth')

const router = new express.Router()

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=> {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send('User logout')
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.status(200).send('User logout of all devices.')
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
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
