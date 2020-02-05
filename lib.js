const openWeatherLocation = require('./current.city.list.min.json') 
const tzlookup = require('tz-lookup')

function getTimeFromLocation(currentTime, location) {
  return openWeatherLocation
   .filter( (cityJson) => cityJson.name === location )
   .map((cityJson) => cityJson.coord)
   .map((latLogJson) => tzlookup(latLogJson.lat, latLogJson.lon))
   .map( (timezone) => currentTime.tz(timezone).format() )
   //TODO: Handle multimapped location
   .slice(0,1)	
}

exports.getTimeFromLocation = getTimeFromLocation  
