const express = require('express')
const mongoose = require('./database/mongoose')
const { users } = require('./models/user')
const { tasks } = require('./models/task')
const user = require('./models/user')
const task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res)=>{
    const user = new users(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get('/users', async (req, res)=>{
    try {
        const user = await users.find({})
        res.status(302).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/users/:id', async (req, res)=>{
    const id = req.params.id

    try {
        const user = await users.findById(id)
        res.status(302).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post('/tasks', async (req, res)=>{
    const task = new tasks(req.body)

    try {
        await task.save()
        res.status(302).send(task)
    } catch (error) {
     res.status(500).send(error)   
    }
})

app.get('/tasks', async (req, res)=>{
    try {
        const task = await tasks.find({})
        res.status(302).send(task)
    } catch (error) {
        res.status(404).send()
    }
})
app.get('/tasks/:id', async (req, res)=>{
    const id = req.params.id

    try {
        const task = await tasks.findById(id)
        res.status(302).send(task)
    } catch (error) {
        res.status(404).send(error)
    }
})

app.listen(port, ()=>{
    console.log('Server running on '+port)
})