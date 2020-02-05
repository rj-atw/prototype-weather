const readline = require('readline')
const moment = require('moment-timezone')
const weather = require('./lib.js')

const rl = readline.createInterface({input: process.stdin});

const currentTime = moment()

rl.on('line', (input) => {
   weather.getTimeFromLocation(currentTime, input) 
     .forEach( l => console.log(l))	
})

