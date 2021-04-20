const mongoose = require('mongoose')
const { default: validator } = require('validator')
const vaildator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
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

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const users = mongoose.model('Users', userSchema)

module.exports = {
    users: users
}