#!/usr/bin/env node

const openWeatherLocation = require('./current.city.list.min.json') 
const tzlookup = require('tz-lookup')
const request = require('request-promise-native')
const config = require('config');

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
  asJson() {
    return {
      locationName: this.location,
      weather: {
        summary: this.weather.detail,
        temp: this.weather.tempature
      },
      time: this.iso8601Time()
    }
  }
}

class Weather {
  constructor(detail, tempature) { 
    this.detail = detail
    this.tempature = tempature   
  }
}

function getLocationDetails(currentTime, locationName) {
  const locationJsonOrError = findLocationFromName(locationName)

  if(locationJsonOrError.error) return Promise.reject(locationJsonOrError)
  //ToDo handle if locationJsonOrError.id is undefined This should never happen
  
  const locationJson = locationJsonOrError

  const locationWeatherPromise = getWeatherForLocation(locationJson)

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

function getWeatherForLocation(locationJson) {
  const id = locationJson.id
  
  return request({
    uri:'https://api.openweathermap.org/data/2.5/weather',
    qs: {
      'id': id,
      'appid': config.apiKey
    }
  }).then(jsonString => {
    const json = JSON.parse(jsonString)
    //Need to select a station for reporting weather
    return new Weather(json.weather[0].main, json.main.temp)
  }
  )
  //ToDo: catch and propagate cleaner error
}

exports.getLocationDetails = getLocationDetails  
exports.FindingLocationError = FindingLocationError
