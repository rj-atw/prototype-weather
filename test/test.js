const assert = require('assert')
const weather = require('../lib.js')
const moment = require('moment-timezone')

const timeNotInDailySavings = moment("2020-01-05T01:00:00Z")
const timePotentialInDailySavings = moment("2020-06-05T01:00:00Z")
const timeNearLeapDay = moment("2020-02-29T01:00:00Z")

describe('Fundemental Locations Test Cases...if these break the program is definitely incorrect', function() {
  it('New York is 5 hours behind UTC (non dst)', function() {
  	assert.equal(weather.getTimeFromLocation(timeNotInDailySavings, 'New York'), '2020-01-04T20:00:00-05:00')
  }),
  it('New York is 4 hours behind UTC during dst', function() {
  	assert.equal(weather.getTimeFromLocation(timePotentialInDailySavings, 'New York'), '2020-06-04T21:00:00-04:00')
  }),
  it('Delhi is always 5 hours and 30 minutes ahead of UTC', function() {
  	assert.equal(weather.getTimeFromLocation(timeNotInDailySavings, 'Delhi'), '2020-01-05T06:30:00+05:30')
  	assert.equal(weather.getTimeFromLocation(timePotentialInDailySavings, 'Delhi'), '2020-06-05T06:30:00+05:30')
  }),
  it('Timezone adjustment is handled correctly spanning over leap days', function() {
  	assert.equal(weather.getTimeFromLocation(timeNearLeapDay, 'Seattle'), '2020-02-28T17:00:00-08:00')
  })
})

describe('Implicit (current implementation) Locations Test Cases...if these break, issue maybe compatiblity not correctness', function() {
  it('Case should not matter', function() {
  	assert.equal(weather.getTimeFromLocation(timePotentialInDailySavings, 'new york'), '2020-06-04T21:00:00-04:00')
  }),	
  it('Regardless of utf8 character, São Paulo is 3 behind UTC', function() {
  	assert.equal(weather.getTimeFromLocation(timeNotInDailySavings, 'São Paulo'), '2020-01-04T22:00:00-03:00')
  }),
  it('Latinised  São Paulo -> San Paulo should also work', function() {
    assert.equal(weather.getTimeFromLocation(timeNotInDailySavings, 'Sao Paulo'), '2020-01-04T22:00:00-03:00')
  }),
  it('London is both in UK and Canada, so is an ambiguous location', function() {
    assert.ok(weather.getTimeFromLocation(timeNotInDailySavings, 'London') instanceof weather.FindingLocationError)
  }),
  it('British Columbia though a valid location is too large to map to a single weather point', function() {
    assert.ok(weather.getTimeFromLocation(timeNotInDailySavings, 'British Columbia') instanceof weather.FindingLocationError)
  })  
})