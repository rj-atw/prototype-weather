const readline = require('readline')
const moment = require('moment-timezone')
const weather = require('./lib.js')

const rl = readline.createInterface({input: process.stdin});

const currentTime = moment()

rl.on('line', (input) => {
   weather.getLocationDetails(currentTime, input)
   .then(l => console.log(JSON.stringify(l.asJson())))
   .catch(l => console.warn(JSON.stringify(l))) 
})

