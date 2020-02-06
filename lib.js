const openWeatherLocation = require('./current.city.list.min.json') 
const tzlookup = require('tz-lookup')

class FindingLocationError {
  constructor(error, location, estimate) {
    this.error = error
    this.location = location	  
    this.estimate
  }
}

function getTimeFromLocation(currentTime, location) { 
  var locations = openWeatherLocation
   .filter( (cityJson) => cityJson.name.localeCompare(location, 'en', {'sensitivity': 'base'}) == 0 )
   //Limiting to a single layer of the geo hierarchy used by openweathermap 
   .filter( (cityJson) => cityJson.geoname.cl === 'P')	
  
  if(locations.length == 0) {
    return new FindingLocationError("Location is unknown by the weather database",location, null)
  }

  if(locations.length > 1) {
    return new FindingLocationError("Location is ambiguous", location, locations.splice(0,1))
  }

  return locations
   .map((cityJson) => cityJson.coord)
   .map((latLogJson) => tzlookup(latLogJson.lat, latLogJson.lon))
   .map( (timezone) => currentTime.tz(timezone).format() )
}

exports.getTimeFromLocation = getTimeFromLocation  
exports.FindingLocationError = FindingLocationError
