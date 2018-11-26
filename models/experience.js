const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Experience = new Schema({
    user_id: { type: String, required: true },
    company: { type: String },
    position: { type: String },
    description: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    start_date_slug: { type: String },
    end_date_slug: { type: String },

    created_on: { type: Date, default: new Date() },
    modified_on: { type: Date }
})

module.exports = mongoose.model('Experience', Experience)
