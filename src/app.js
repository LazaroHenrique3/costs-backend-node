const express = require('express')
const router = require('./router')
const cors = require('cors')

//Rodando o mongo
require('./database')

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)

module.exports = app