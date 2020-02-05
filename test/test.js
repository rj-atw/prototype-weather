const assert = require('assert')
const weather = require('../lib.js')
const moment = require('moment-timezone')

const time = moment("2020-01-05T01:00:00Z")

describe('Locations', function() {
  it('London should shift by 0 hours when not in dst', function() {
    assert.equal(weather.getTimeFromLocation(time, 'London'),'2020-01-05T01:00:00Z')
  })
})
