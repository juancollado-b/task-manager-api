const express = require('express')
require('./db/mongoose')
const User = require('./models/users')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)

    user.save().then(() => {
        res.send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.listen(PORT, ()=> {
    console.log(`Server is up on port ${PORT}`)
})