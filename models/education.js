const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Education = new Schema({
    user_id: { type: String, required: true },
    degree: { type: String },
    course: { type: String },
    school: { type: String },
    start_date: { type: String },
    end_date: { type: String },

    created_on: { type: String, default: new Date() },
    modified_on: { type: String }
})

module.exports = mongoose.model('Education', Education)
