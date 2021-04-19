const mongoose = require('mongoose')
const { default: validator } = require('validator')
const vaildator = require('validator')

const tasks = mongoose.model('Tasks',{
    description: {
        type: String,
        required: [true, 'The description for a task is required'],
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = {
    tasks: tasks
}