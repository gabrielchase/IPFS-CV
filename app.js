const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

const config = require('./config/config')

// "mongodb://admin:admin11@ds159180.mlab.com:59180/thesis-dev-db",
console.log('DB_URL: ', config.DB_URL)
mongoose.connect(config.DB_URL, { useNewUrlParser: true })
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error'))

const app = new express()

app.use(bodyParser.json({ limit: '192mb' }))
app.use(bodyParser.urlencoded({ extended: true })) // to support URL-encoded bodies
app.use(cors())

require('./routes/auth_routes')(app)
require('./routes/user_routes')(app, ipfs)

app.listen(config.PORT, () => {
    console.log(`Server running on ${config.PORT}`)
})
