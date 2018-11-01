const User = require('../models/user')
const Education = require('../models/education')
const { success, fail } = require('../utils')
const { checkJWT, checkUser } = require('../middlewares')

module.exports = function(app) {
    app.get('/api/user/:user_id', checkJWT, checkUser, async (req, res) => {
        const { user_id } = req.params
        try {
            const user = await User.findById(user_id)
            const user_json = {
                _id: user._id,
                email: user.email,
                first_name: user.first_name, 
                last_name: user.last_name,
                created_on: user.created_on
            }
            success(res, user_json)
        } catch (err) {
            fail(res, err)
        }
    })

    app.put('/api/user/:user_id', checkJWT, checkUser, async (req, res) => {
        const { user_id } = req.params 
        const { email, first_name, last_name, birthday } = req.body 
        try {
            let year, month, day, _birthday 
            
            if (birthday) {
                [ year, month, day ] = birthday.split('-')
                _birthday = new Date(parseInt(year), parseInt(month), parseInt(day)).toString()
            }

            const updated_user = await User.findOneAndUpdate(
                { _id: user_id }, 
                { email, first_name, last_name, _birthday, modified_on: new Date() }, 
                { upsert: true }
            )

            console.log('Updated user with: ', updated_user)

            const updated_user_json = {
                _id: updated_user._id,
                email: updated_user.email,
                first_name: updated_user.first_name, 
                last_name: updated_user.last_name,
                birthday: _birthday,
                created_on: updated_user.created_on,
                modified_on: updated_user.modified_on
            }
            
            success(res, updated_user_json)
        } catch (err) {
            fail(res, err)
        }
    })

    app.post('/api/user/:user_id/education', checkJWT, checkUser, async (req, res) => {
        const { user_id } = req.params 
        try {
            req.body.user_id = user_id
            const user_education = await new Education(req.body)
            await user_education.save()
            console.log(`Added education for ${req.user.email}: `, user_education)

            success(res, user_education)
        } catch (err) {
            fail(res, err)
        }
    })

    app.get('/api/user/:user_id/education/:education_id', checkJWT, checkUser, async (req, res) => {
        const { user_id, education_id } = req.params 
        try {
            const user_education = await Education.findOne({ _id: education_id, user_id })
            success(res, user_education)
        } catch (err) {
            fail(res, err)
        }
    })
    
    app.put('/api/user/:user_id/education/:education_id', checkJWT, checkUser, async (req, res) => {
        const { user_id, education_id } = req.params 
        try {
            console.log('Updating education with the ff data: ', req.body)
            req.body.modified_on = new Date()
            req.body.user_id = user_id

            const updated_education = await Education.findOneAndUpdate(
                { _id: education_id }, 
                req.body,
                { upsert: true, new: true }
            )

            console.log('Updated education: ', updated_education)
            
            success(res, updated_education)
        } catch (err) {
            fail(res, err)
        }
    })
    
}
