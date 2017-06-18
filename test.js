'use strict'
const TestRunner = require('test-runner')
const request = require('./')
const a = require('assert')

const runner = new TestRunner()

runner.test('http, string url', function () {
  return request('http://www.bbc.co.uk')
    .then(function (response) {
      return require('util').inspect(response, { depth: 2, colors: true })
    })
})

runner.test('https, string url', function () {
  return request('https://www.bbc.co.uk')
    .then(function (response) {
      return require('util').inspect(response, { depth: 2, colors: true })
    })
})

runner.test('http, reqOptions', function () {
  const url = require('url')
  return request(url.parse('http://www.bbc.co.uk'))
    .then(function (response) {
      return require('util').inspect(response, { depth: 2, colors: true })
    })
})

runner.test('https, reqOptions', function () {
  const url = require('url')
  return request(url.parse('https://www.bbc.co.uk'))
    .then(function (response) {
      return require('util').inspect(response, { depth: 2, colors: true })
    })
})

runner.test('bad: no reqOptions', function () {
  return request()
})
