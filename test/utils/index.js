const supertest = require("supertest");

const { default: app } = require("src/app");

module.exports.request = function(method, url) {
  if (app) {
    return supertest(app)[method](`${url}`)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");
  } else {
    throw new Error('database must be initialized.');
  }
}

module.exports.handleError = function(error) {
  console.error('-------------------------------------------------------');
  console.error('Test failed:');
  console.error(error);
  console.error('-------------------------------------------------------');
}

module.exports.pre = function(endpoint, payload) {
  console.log('Pre -> Mock?', process.env.MOCK);
  if (endpoint) console.log('Endpoint:', endpoint);
  if (payload) console.log('Payload:', payload);
}

module.exports.post = function(res, fail, title, payload) {
  console.log(JSON.stringify({
    "status": fail ? "fail" : "pass",
    "title": title,
    "mocked": JSON.parse(process.env.MOCK),
    "res.statusCode": res.statusCode,
    "res.body": res.body,
    "payload": payload
  }, null, 2), '------------------------------------------------------------');
}
