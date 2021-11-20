var bunyan = require('bunyan');
var logger = module.exports = {};
var path = require('path');

(function () {
    logger.root = bunyan.createLogger({
        name: 'bitgo',
        streams : [{
            level: 'info',
            stream: process.stdout
        }, {
            level : 'error',
            stream: process.stderr
        }]
    });
})()
