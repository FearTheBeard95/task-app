const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { users } = require('../../src/models/user')
const { tasks } = require('../../src/models/task')

const testUserId = new mongoose.Types.ObjectId()
const testUserId2 = new mongoose.Types.ObjectId()

const testUser = {
    _id: testUserId,
    name: 'user',
    email: 'test@example.com',
    password: 'Kurbeans1.',
    role: 'admin',
    tokens: [{
        token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)
    }]
}

const testUser2 = {
    _id: testUserId2,
    name: 'user2',
    email: 'test2@example.com',
    password: 'Kurbeans1.',
    role: 'admin',
    tokens: [{
        token: jwt.sign({ _id: testUserId2 }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: true,
    owner: testUserId._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: testUserId2._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Three task',
    completed: false,
    owner: testUserId2._id
}

const setupDatabase = async () => {
    await users.deleteMany()
    await tasks.deleteMany()
    await new users(testUser).save()
    await new tasks(taskOne).save()
    await new tasks(taskTwo).save()
    await new tasks(taskThree).save()
}

module.exports = {
    testUserId,
    testUser,
    setupDatabase,
    testUser2,
    taskOne,
    taskTwo,
    taskThree
}