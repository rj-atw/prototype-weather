const assert = require('assert')
const weather = require('../lib.js')
const moment = require('moment-timezone')

const time = moment("2020-01-05T01:00:00Z")

describe('Locations', function() {
  it('London is both in UK and Canada', function() {
  	console.log(weather.getTimeFromLocation(time, 'London'))
    assert.ok(weather.getTimeFromLocation(time, 'London') instanceof weather.LocationError)
  }),
  it('New York is 5 hours behind UTC (non dst)', function() {
  	assert.equal(weather.getTimeFromLocation(time, 'New York'), '2020-01-04T20:00:00-05:00')
  })
})
