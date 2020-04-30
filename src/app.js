const express = require('express')
require('./db/mongoose')
const userRouters = require('./routers/userRouters'),
    taskRouters = require('./routers/taskRouters')
    
const app = express()

app.use(express.json())
app.use(userRouters,taskRouters)

module.exports = app