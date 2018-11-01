const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const { success, fail } = require('../utils')
const { JWT_SECRET, JWT_EXPIRATION, SALT_ROUNDS } = require('../config/config')

module.exports = function(app) {
    app.post('/api/auth/login', async (req, res) => {
        const { email, password } = req.body 
        try {
            const user = await User.findOne({ email })

            if (user.deleted_on) 
                throw new Error('User deleted')

            const match = await bcrypt.compare(password, user.password)

            if (match) {
                const signed_jwt = jwt.sign({ _id: user._id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
                const auth_json = {
                    _id: user._id,
                    email: user.email,
                    token: signed_jwt
                }

                success(res, auth_json)
            } 

            throw new Error('Username or email is not registered')
        } catch (err) {
            fail(res, err)
        }
    })

    app.post('/api/user', async (req, res) => {
        const { email, password } = req.body

        try {
            const hashed_password = await bcrypt.hash(password, SALT_ROUNDS)
            const new_user = await new User({
                email, 
                password: hashed_password,
            })
            await new_user.save()
            console.log('New user was created: ', new_user)
            
            const new_user_json = {
                _id: new_user._id,
                email, 
                created_on: new_user.created_on
            }

            success(res, new_user_json)
        } catch (err) {
            fail(res, err)
        }
    })
}
