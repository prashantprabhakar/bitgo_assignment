
const router = require("express").Router();
const main = require('./main')
const btc = require('./btc')


router.use('/app', main)
router.use('/btc', btc)



module.exports = router