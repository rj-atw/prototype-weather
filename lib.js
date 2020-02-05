const openWeatherLocation = require('./current.city.list.min.json') 
const tzlookup = require('tz-lookup')

class LocationError {
  constructor(error, location, estimate) {
    this.error = error
    this.location = location	  
    this.estimate
  }
}

function latinise(word) {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function getTimeFromLocation(currentTime, location) {
  // openweathermap database has latinised (ascii) version of location name
  // e.g. "São Paulo" -> "Sao Paulo"
  location = latinise(location)
  
  var locations = openWeatherLocation
   .filter( (cityJson) => cityJson.name === location )
   //Limiting to a single layer of the geo hierarchy used by openweathermap 
   .filter( (cityJson) => cityJson.geoname.cl === 'P')	
  
  if(locations.length == 0) {
    return new LocationError("Location is unknown by the weather database",	location, null)
  }

  if(locations.length > 1) {
    return new LocationError("Location is ambiguous", location, locations.splice(0,1))
  }

  return locations
   .map((cityJson) => cityJson.coord)
   .map((latLogJson) => tzlookup(latLogJson.lat, latLogJson.lon))
   .map( (timezone) => currentTime.tz(timezone).format() )
}

exports.getTimeFromLocation = getTimeFromLocation  
exports.LocationError = LocationError
