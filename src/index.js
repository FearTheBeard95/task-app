const express = require('express')
const mongoose = require('./database/mongoose')
const { users } = require('./models/user')
const { tasks } = require('./models/task')
const user = require('./models/user')
const task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log('Server running on '+port)
})