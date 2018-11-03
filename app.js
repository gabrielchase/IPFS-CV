const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

const config = require('./config/config')

mongoose.connect(config.DB_URL, { useNewUrlParser: true })
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))

const app = new express()

app.use(cors())
app.use(bodyParser.json({ limit: '192mb' }))
app.use(bodyParser.urlencoded({ extended: true })) // to support URL-encoded bodies

require('./routes/auth_routes')(app)
require('./routes/user_routes')(app, ipfs)

app.listen(config.PORT, () => {
    console.log(`Server running on ${config.PORT}`)
})
