const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { default: validator } = require('validator')
const vaildator = require('validator')
const bcrypt = require('bcrypt')
const {tasks} = require('../models/task')

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
        unique: true,
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
    },
    role: {
        type: String,
        required: [true, 'User role must be specified'],
        trim: true,
        validate(value){
            const roles = ['admin', 'user']
            const roleSearch = roles.find((role)=>role === value.toLowerCase())
            if(!roleSearch){
                throw new Error('invalid role')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await users.findOne({ email })
    if(!user){
        throw new Error ('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error ('Unable to login')
    }

    return user
}

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({_id: this._id.toString()}, 'thisisanexample')

    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

userSchema.methods.toJSON = function(){
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.role
    delete userObject.avatar

    return userObject
}

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete user tasks

userSchema.pre('remove', async function(next){
    await tasks.deleteMany({owner: this._id})
    next()
})

const users = mongoose.model('Users', userSchema)

module.exports = {
    users: users
}