module.exports = {
    success: (res, data) => {
        const obj = {
            success: true,
            data: data
        }
        res.json(obj)
    },
    fail: (res, err) => {
        console.log(err)
        const obj = {
            success: false,
            reason: err.message
        }
        res.json(obj)
    },
    convertYearMonth: (date) => {
        const [ year, month ] = date.split('-')
        const converted_date = new Date(parseInt(year), parseInt(month)).toString()
        
        if (converted_date === 'Invalid Date') 
            throw new Error('Invalid Date')
        else 
            return converted_date 
    }
}