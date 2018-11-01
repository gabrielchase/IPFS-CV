const User = require('../models/user')
const { success, fail } = require('../utils')
const { checkJWT, checkUser } = require('../middlewares')

module.exports = function(app) {
    app.get('/api/user/:id', checkJWT, checkUser, async (req, res) => {
        const { id } = req.params

        try {
            const user = await User.findById(id)
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

    app.put('/api/user/:id', checkJWT, checkUser, async (req, res) => {
        const { id } = req.params 
        const { email, first_name, last_name, birthday } = req.body 

        try {
            let year, month, day, _birthday 
            
            if (birthday) {
                [ year, month, day ] = birthday.split('-')
                console.log(parseInt(year), parseInt(month), parseInt(day))
                _birthday = new Date(parseInt(year), parseInt(month), parseInt(day)).toString()
            }

            let updated_user = await User.findOneAndUpdate(
                { _id: id }, 
                { email, first_name, last_name, _birthday, modified_on: new Date() }, 
                { upsert: true }
            )

            console.log('Updating user with: ', updated_user)

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
}
