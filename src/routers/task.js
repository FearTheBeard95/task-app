const { Router } = require("express")
const express = require("express")
const { tasks } = require('../models/task')
const {users} = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new tasks({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(302).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        const user = await users.findById(req.user._id)
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(user.tasks)
    } catch (error) {
        res.status(404).send()
    }
})
router.get('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id

    try {
        const task = await tasks.findOne({id, owner: req.user._id})

        if (!task) {
            return res.status(404).send
        }
        res.status(302).send(task)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const task = await tasks.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await tasks.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router