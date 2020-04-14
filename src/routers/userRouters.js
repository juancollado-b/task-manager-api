const express = require('express'),
    multer = require('multer'),
    sharp = require('sharp')
    User = require('../models/users'),
    auth = require('../middlewares/auth'),
    { welcomeEmail, cancelationEmail } = require('../emails/account')


const router = new express.Router()

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        await user.save()
        welcomeEmail(user.email,user.name)
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

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body),
        allowedUpdates = ['name', 'email', 'password', 'age'],
        isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send('Update not allowed')
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        cancelationEmail(req.user.email,req.user.name)
        res.status(200).send('User deleted')
    } catch (e) {
        res.status(500).send()
    }
})

const uploads = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error("Images file with .jpg .jpeg .png format only"))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, uploads.single('avatar'), async (req,res) => {
    try {
        const buffer = await sharp(req.file.buffer)
            .resize({width: 250, height: 250})
            .png()
            .toBuffer()

        req.user.avatar = buffer
        await req.user.save()

        res.send({message: 'Image uploaded succesfully'})
    } catch (e) {
        res.status(500).send({e})
    }

}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req,res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }


})

router.delete('/users/me/avatar', auth, async (req,res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
