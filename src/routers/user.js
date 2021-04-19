const { Router } = require('express')
const express = require('express')
const {users} = require('../models/user')

const router = new express.Router()

router.post('/users', async (req, res)=>{
    const user = new users(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users', async (req, res)=>{
    try {
        const user = await users.find({})
        res.status(302).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/:id', async (req, res)=>{
    const id = req.params.id

    try {
        const user = await users.findById(id)
        res.status(302).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/users/:id', async(req,res)=>{
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

router.delete('/users/:id', async(req, res)=>{
    try {
        const user = await users.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router