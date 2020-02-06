const assert = require('assert')
const weather = require('../lib.js')
const moment = require('moment-timezone')

const chai = require('chai');
const expect = chai.expect;
chai.use(require("chai-as-promised"));

const timeNotInDailySavings = moment("2020-01-05T01:00:00Z")
const timePotentialInDailySavings = moment("2020-06-05T01:00:00Z")
const timeNearLeapDay = moment("2020-02-29T01:00:00Z")


describe('Fundemental Locations Test Cases...if these break the program is definitely incorrect', function() {
  it('New York is 5 hours behind UTC (non dst)', function() {
    return expect(weather.getLocationDetails(timeNotInDailySavings, 'New York').then(l => l.iso8601Time())).to.eventually.equal('2020-01-04T20:00:00-05:00')
  }),
  it('New York is 4 hours behind UTC during dst', function() {
  	return expect(weather.getLocationDetails(timePotentialInDailySavings, 'New York').then(l => l.iso8601Time())).to.eventually.equal('2020-06-04T21:00:00-04:00')
  }),
  it('Delhi is always 5 hours and 30 minutes ahead of UTC', function() {
  	return Promise.all([
      expect(weather.getLocationDetails(timeNotInDailySavings, 'Delhi').then(l => l.iso8601Time())).to.eventually.equal('2020-01-05T06:30:00+05:30'),
  	  expect(weather.getLocationDetails(timePotentialInDailySavings, 'Delhi').then(l => l.iso8601Time())).to.eventually.equal('2020-06-05T06:30:00+05:30')
    ])
  }),
  it('Timezone adjustment is handled correctly spanning over leap days', function() {
  	return expect(weather.getLocationDetails(timeNearLeapDay, 'Seattle').then(l => l.iso8601Time())).to.eventually.equal('2020-02-28T17:00:00-08:00')
  })
})

describe('Implicit (current implementation) Locations Test Cases...if these break, issue maybe compatiblity not correctness', function() {
  it('Case should not matter', function() {
  	return expect(weather.getLocationDetails(timePotentialInDailySavings, 'new york').then(l => l.iso8601Time())).to.eventually.equal('2020-06-04T21:00:00-04:00')
  }),	
  it('Regardless of utf8 character, São Paulo is 3 behind UTC', function() {
  	return expect(weather.getLocationDetails(timeNotInDailySavings, 'São Paulo').then(l=> l.iso8601Time())).to.eventually.equal('2020-01-04T22:00:00-03:00')
  }),
  it('Latinised  São Paulo -> San Paulo should also work', function() {
    return expect(weather.getLocationDetails(timeNotInDailySavings, 'Sao Paulo').then(l => l.iso8601Time())).to.eventually.equal('2020-01-04T22:00:00-03:00')
  }),
  it('London is both in UK and Canada, so is an ambiguous location', function() {
    return expect(weather.getLocationDetails(timeNotInDailySavings, 'London')).to.eventually.be.rejected.have.instanceof(weather.FindingLocationError)
  }),
  it('British Columbia though a valid location is too large to map to a single weather point', function() {
    return expect(weather.getLocationDetails(timeNotInDailySavings, 'British Columbia')).to.eventually.be.rejected.have.instanceof(weather.FindingLocationError)
  })  
})