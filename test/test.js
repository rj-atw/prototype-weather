const assert = require('assert')
const weather = require('../lib.js')
const moment = require('moment-timezone')

const timeNotInDailySavings = moment("2020-01-05T01:00:00Z")
const timePotentialInDailySavings = moment("2020-06-05T01:00:00Z")
const timeNearLeapDay = moment("2020-02-29T01:00:00Z")

describe('Locations', function() {
  it('London is both in UK and Canada', function() {
  	console.log(weather.getTimeFromLocation(timeNotInDailySavings, 'London'))
    assert.ok(weather.getTimeFromLocation(timeNotInDailySavings, 'London') instanceof weather.LocationError)
  }),
  it('New York is 5 hours behind UTC (non dst)', function() {
  	assert.equal(weather.getTimeFromLocation(timeNotInDailySavings, 'New York'), '2020-01-04T20:00:00-05:00')
  }),
  it('New York is 4 hours behind UTC during dst', function() {
  	assert.equal(weather.getTimeFromLocation(timePotentialInDailySavings, 'New York'), '2020-06-04T21:00:00-04:00')
  }),
  it('Regardless of utf8 character, São Paulo is 3 behind UTC', function() {
  	assert.equal(weather.getTimeFromLocation(timeNotInDailySavings, 'São Paulo'), '2020-01-04T22:00:00-03:00')
  }),
  it('Timezone adjustment is handled correctly spanning over leap days', function() {
  	assert.equal(weather.getTimeFromLocation(timeNearLeapDay, 'Seattle'), '2020-02-28T17:00:00-08:00')
  })
})
