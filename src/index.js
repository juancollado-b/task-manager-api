const express = require('express')
require('./db/mongoose')
const userRouters = require('./routers/userRouters'),
    taskRouters = require('./routers/taskRouters')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(userRouters,taskRouters)


app.listen(PORT, ()=> {
    console.log(`Server is up on port ${PORT}`)
})