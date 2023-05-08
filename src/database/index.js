const mongoose = require('mongoose')
const config = require('../config/database')

mongoose.set("strictQuery", false);

mongoose.connect(config.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongo connected')
}).catch(err => {
    console.log(err)
})

module.exports = mongoose