const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const btcFile = require('./routes/btc')
const config = require('./config/config')
// const connectMongo = require('./utils/connectMongo')
const platformRoutes = require('./routes')

const l = require('./utils/logger').root.child({ 'module': 'app' })

const app = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/v1', platformRoutes)

app.listen(config.webport, ()=>{
  l.info('listening on port '+config.webport)
})
