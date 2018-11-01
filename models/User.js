const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    email: { type: String, unique: true },
    password: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    birthday: { type: String },

    created_on: { type: String, default: new Date() },
    modified_on: { type: String },
    deleted_on: { type: String }
})

module.exports = mongoose.model('User', User)
