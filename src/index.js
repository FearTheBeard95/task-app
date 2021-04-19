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

app.patch('/users/:id', async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        const user = await users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
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

app.patch('/tasks/:id', async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        const task = await tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

app.listen(port, ()=>{
    console.log('Server running on '+port)
})