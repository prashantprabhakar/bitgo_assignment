const rp = require('request-promise')
const l = require('../utils/logger').root.child({ 'module': '[httpSvc]' });

exports.POST = async(uri, payload) => {
    let options = {
        uri, method: 'POST',
        body: payload
    }
    try {
        let response = await rp(options)
        l.debug('Response of api', {response, uri, payload})
        if(response.success) return response.data
        else return undefined
    } catch(error) {
        l.alert("API Call Failed", {error})
        return undefined
    }
}

exports.REQUEST = async(payload) => {
    try {
        const { privateKey, privKey, ...remaining } = payload
        l.info('Http request called', {remaining})
        let {uri, qs, body, method} = payload
        method = method || (body ?  'POST': 'GET')
        let response = await rp({uri, method, qs, body, json: true})
        l.debug('Response of http call', {response})
        return response
    } catch(error) {
        throw error
    }
}