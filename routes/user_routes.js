const CV = require('../models/cv')
const User = require('../models/User')
const Education = require('../models/education')
const Experience = require('../models/experience')

const { success, fail, convertYearMonth } = require('../utils')
const { checkJWT, checkUser } = require('../middlewares')
const config = require('../config/config')
const Blockchain = require('../blockchain')

const cvChain = new Blockchain()

module.exports = function(app, ipfs) {
    app.get('/api/user/:user_id', checkJWT, checkUser, async (req, res) => {
        const { user_id } = req.params
        try {
            const user = await User.findById(user_id)
            const education = await Education.find({ user_id }).sort({ end_date: -1 })
            const experience = await Experience.find({ user_id }).sort({ end_date: -1 })
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
                _birthday = new Date(parseInt(year), parseInt(month), parseInt(day))
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

            const start_date = convertYearMonth(req.body.start_date)
            req.body.start_date = start_date.date
            req.body.start_date_slug = start_date.slug

            const end_date = convertYearMonth(req.body.end_date)
            req.body.end_date = end_date.date 
            req.body.end_date_slug = end_date.slug
            
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

            const start_date = convertYearMonth(req.body.start_date)
            req.body.start_date = start_date.date
            req.body.start_date_slug = start_date.slug

            const end_date = convertYearMonth(req.body.end_date)
            req.body.end_date = end_date.date 
            req.body.end_date_slug = end_date.slug

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

    app.delete('/api/user/:user_id/education/:education_id', checkJWT, checkUser, async (req, res) => {
        const { user_id, education_id } = req.params 
        try {
            console.log('Deleting Education ID: ', education_id)
            await Education.findOneAndDelete({ _id: education_id, user_id })
            success(res, { deleted: education_id })    
        } catch (err) {
            fail(res, err)
        }
    })

    app.post('/api/user/:user_id/experience', checkJWT, checkUser, async (req, res) => {
        const { user_id } = req.params 
        try {
            req.body.user_id = user_id

            const start_date = convertYearMonth(req.body.start_date)
            req.body.start_date = start_date.date
            req.body.start_date_slug = start_date.slug

            const end_date = convertYearMonth(req.body.end_date)
            req.body.end_date = end_date.date 
            req.body.end_date_slug = end_date.slug
            
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
            
            const start_date = convertYearMonth(req.body.start_date)
            req.body.start_date = start_date.date
            req.body.start_date_slug = start_date.slug

            const end_date = convertYearMonth(req.body.end_date)
            req.body.end_date = end_date.date 
            req.body.end_date_slug = end_date.slug

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

    app.delete('/api/user/:user_id/experience/:experience_id', checkJWT, checkUser, async (req, res) => {
        const { user_id, experience_id } = req.params 
        try {
            console.log('Deleting Experience ID: ', experience_id)
            await Experience.findOneAndDelete({ _id: experience_id, user_id })
            success(res, { deleted: experience_id })    
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
                
                let new_cv = await new CV({
                    user_id,
                    hash: uploaded_file[0].hash
                })
                await new_cv.save()

                new_cv.index = cvChain.makeNewTransaction(uploaded_file[0].hash, user_id)
                
                success(res, new_cv)
            } 
        } catch (err) {
            fail(res, err)
        }
    })

    app.get('/api/cvchain', checkJWT, async (req, res) => {
        res.send(cvChain)
    })

    app.get('/api/cvchain/mine', checkJWT, async (req, res) => {
        try {
            const latest_block = cvChain.getLatestBlock()
            const prev_block_hash = latest_block.hash
            const current_block_data = {
                transactions: cvChain.transactions, 
                index: latest_block.index + 1
            }
            const nonce = cvChain.proofOfWork(prev_block_hash, current_block_data)
            const block_hash = cvChain.hashBlock(prev_block_hash, current_block_data, nonce)
    
            cvChain.makeNewTransaction('00000', 'FINISHED_TRANSACTION', config.NODE_ADDR)
    
            const new_block = cvChain.createNewBlock(nonce, prev_block_hash, block_hash)
    
            success(res, new_block)
        } catch (err) {
            fail(res, err)
        }
    })
}
