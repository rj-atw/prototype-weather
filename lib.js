const openWeatherLocation = require('./current.city.list.min.json') 
const tzlookup = require('tz-lookup')

class FindingLocationError {
  constructor(error, location, estimate) {
    this.error = error
    this.location = location	  
    this.estimate
  }
}

class LocationDetails {
  constructor(location, time, weather) {
    this.location = location
    this.weather = weather
    this.time = time
  }

  iso8601Time() { 
    return this.time.format()
  }
}

class Weather {
  constructor() {    
  }
}



function getLocationDetails(currentTime, locationName) {
  const locationJsonOrError = findLocationFromName(locationName)

  if(locationJsonOrError.error) return Promise.reject(locationJsonOrError)
  //ToDo handle if locationJsonOrError.id is undefined This should never happen
  
  const locationJson = locationJsonOrError

  const locationWeatherPromise = Promise.resolve(null)

  const locationAdjustedTime = getTimeFromLocation(currentTime, locationJson)

  return locationWeatherPromise.then(weather => new LocationDetails(locationName, locationAdjustedTime, weather))
}

function findLocationFromName(locationName) {
  const locations = openWeatherLocation
   .filter( (cityJson) => cityJson.name.localeCompare(locationName, 'en', {'sensitivity': 'base'}) == 0 )
   //Limiting to a single layer of the geo hierarchy used by openweathermap 
   .filter( (cityJson) => cityJson.geoname.cl === 'P')  
  
  if(locations.length == 0) {
    return new FindingLocationError("Location is unknown by the weather database",locationName, null)
  }

  if(locations.length > 1) {
    return new FindingLocationError("Location is ambiguous", locationName, locations.splice(0,1))
  }

  return locations.pop()
}

function getTimeFromLocation(currentTime, location) { 
  const ianaTimezone = tzlookup(location.coord.lat, location.coord.lon)

  return currentTime.tz(ianaTimezone)
}

exports.getLocationDetails = getLocationDetails  
exports.FindingLocationError = FindingLocationError
