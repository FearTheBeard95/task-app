const { Router } = require("express")
const express = require("express")
const {tasks} = require('../models/task')

const router = express.Router()

router.post('/tasks', async (req, res)=>{
    const task = new tasks(req.body)

    try {
        await task.save()
        res.status(302).send(task)
    } catch (error) {
     res.status(500).send(error)   
    }
})

router.get('/tasks', async (req, res)=>{
    try {
        const task = await tasks.find({})
        res.status(302).send(task)
    } catch (error) {
        res.status(404).send()
    }
})
router.get('/tasks/:id', async (req, res)=>{
    const id = req.params.id

    try {
        const task = await tasks.findById(id)
        if(!task){
            return res.status(404).send
        }
        res.status(302).send(task)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.patch('/tasks/:id', async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        const task = await tasks.findById(req.params.id)

        updates.forEach((update)=>{
            task[update] = req.body[update]
        })

        await task.save()
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', async (req,res)=>{
    try {
        const task = await tasks.findByIdAndDelete(req.params.id)

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router