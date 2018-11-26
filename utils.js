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
        const converted_date = new Date(parseInt(year), parseInt(month))
        
        if (converted_date === 'Invalid Date') 
            throw new Error('Invalid Date')
        else {
            const date_string = converted_date.toString().split(' ')
            const date_slug = `${date_string[1]} ${date_string[3]}`
            return { date: converted_date, slug: date_slug }
        }
    }
}