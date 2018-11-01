const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Experience = new Schema({
    user_id: { type: String, required: true },
    company: { type: String },
    position: { type: String },
    description: { type: String },
    start_date: { type: String },
    end_date: { type: String },

    created_on: { type: String, default: new Date() },
    modified_on: { type: String }
})

module.exports = mongoose.model('Experience', Experience)
