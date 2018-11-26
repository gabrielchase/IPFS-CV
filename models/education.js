const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Education = new Schema({
    user_id: { type: String, required: true },
    degree: { type: String },
    course: { type: String },
    school: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    start_date_slug: { type: String },
    end_date_slug: { type: String },

    created_on: { type: Date, default: new Date() },
    modified_on: { type: Date }
})

module.exports = mongoose.model('Education', Education)
