const fs = require('fs');

const errorHandler = (err, req, res, next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500

    fs.writeFile("ErorrLog.txt", data, (err) => {
        if (err) throw err
    })
    
    res.status(statusCode)

    res.json({
        message : err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    
    })


}
module.exports = {
    errorHandler
}