const CV = require('../models/cv')
const User = require('../models/user')
const Education = require('../models/education')
const Experience = require('../models/experience')

const { success, fail, convertYearMonth } = require('../utils')
const { checkJWT, checkUser } = require('../middlewares')

module.exports = function(app, ipfs) {
    app.get('/api/user/:user_id', checkJWT, checkUser, async (req, res) => {
        const { user_id } = req.params
        try {
            const user = await User.findById(user_id)
            const education = await Education.find({ user_id })
            const experience = await Experience.find({ user_id })
            const cv_history = await CV.find({ user_id })
            const user_json = {
                _id: user._id,
                email: user.email,
                first_name: user.first_name, 
                last_name: user.last_name,
                created_on: user.created_on,
                modified_on: user.modified_on,
                education, 
                experience,
                cv_history
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
            req.body.start_date = convertYearMonth(req.body.start_date)
            req.body.end_date = convertYearMonth(req.body.end_date)
            
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
            req.body.start_date = convertYearMonth(req.body.start_date)
            req.body.end_date = convertYearMonth(req.body.end_date)

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

    app.post('/api/user/:user_id/experience', checkJWT, checkUser, async (req, res) => {
        const { user_id } = req.params 
        try {
            req.body.user_id = user_id
            req.body.start_date = convertYearMonth(req.body.start_date)
            req.body.end_date = convertYearMonth(req.body.end_date)
            
            const user_experience = await new Experience(req.body)
            await user_experience.save()

            console.log(`Added experience for ${req.user.email}: `, user_experience)

            success(res, user_experience)
        } catch (err) {
            fail(res, err)
        }
    })

    app.get('/api/user/:user_id/experience/:experience_id', checkJWT, checkUser, async (req, res) => {
        const { user_id, experience_id } = req.params 
        try {
            const user_experience = await Experience.findOne({ _id: experience_id, user_id })
            success(res, user_experience)
        } catch (err) {
            fail(res, err)
        }
    })

    app.put('/api/user/:user_id/experience/:experience_id', checkJWT, checkUser, async (req, res) => {
        const { user_id, experience_id } = req.params 
        try {
            req.body.modified_on = new Date()
            req.body.user_id = user_id
            req.body.start_date = convertYearMonth(req.body.start_date)
            req.body.end_date = convertYearMonth(req.body.end_date)

            const updated_experience = await Experience.findOneAndUpdate(
                { _id: experience_id }, 
                req.body,
                { upsert: true, new: true }
            )

            console.log('Updated experience: ', updated_experience)
            
            success(res, updated_experience)    
        } catch (err) {
            fail(res, err)
        }
    })

    app.post('/api/user/:user_id/cv', checkJWT, checkUser, async (req, res) => {
        const { user_id } = req.params
        try {
            const cv_buffer = Buffer.from(req.body.data, 'binary')
            // await fs.writeFile('./uploads/test69.pdf', req.body.data,'binary')    

            const uploaded_file = await ipfs.files.add(cv_buffer)

            if (uploaded_file) {
                console.log('file uploaded: ', uploaded_file)
                
                const new_cv = await new CV({
                    user_id,
                    hash: uploaded_file[0].hash
                })
                await new_cv.save()
                
                success(res, new_cv)
            } 
        } catch (err) {
            fail(res, err)
        }
    })
}
