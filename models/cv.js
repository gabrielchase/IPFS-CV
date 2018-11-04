const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CV = new Schema({
    user_id: { type: String, required: true },
    hash: { type: String, required: true },

    created_on: { type: String, default: new Date() }
})

module.exports = mongoose.model('CV', CV)
