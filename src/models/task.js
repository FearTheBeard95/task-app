const mongoose = require('mongoose')
const { default: validator } = require('validator')
const vaildator = require('validator')

const tasksSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'The description for a task is required'],
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,'User ID is required'],
        ref: 'Users'
    }
}, {
    timestamps: true
})

const tasks = mongoose.model('Tasks', tasksSchema)

module.exports = {
    tasks: tasks
}