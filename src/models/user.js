const mongoose = require('mongoose')
const { default: validator } = require('validator')
const vaildator = require('validator')

const users = mongoose.model('Users',{
    name: {
        type: String,
        required: true,
        trim: true
    }, age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error ('Age must be a positive')
            }
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('That is not a valid email')
            }
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'The minimum number of characters for a password is 6'],
        trim: true,
        validate(value){
            if(value.toLowerCase() === 'password'){
                throw new Error('password cannot be used as your password')
            }
        }
    }
})

module.exports = {
    users: users
}