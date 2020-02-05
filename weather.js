const openWeatherLocation = require('./current.city.list.min.json') 
const readline = require('readline')
const tzlookup = require('tz-lookup')
const moment = require('moment-timezone')

const rl = readline.createInterface({input: process.stdin});

const currentTime = moment()

rl.on('line', (input) => {
  openWeatherLocation
   .filter( (cityJson) => cityJson.name === input )
   .map((cityJson) => cityJson.coord)
   .map((latLogJson) => tzlookup(latLogJson.lon, latLogJson.lat))
   .map( (timezone) => currentTime.tz(timezone).format() )
   .forEach( l => console.log(l))	
})

