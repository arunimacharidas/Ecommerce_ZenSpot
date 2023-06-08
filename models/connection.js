const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
mongoose.set('strictPopulate', false)
mongoose.connect('mongodb://127.0.0.1:27017/Evara', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to mongoose'))

module.exports = db



