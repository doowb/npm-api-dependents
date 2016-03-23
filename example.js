'use strict';

var co = require('co');
var npm = require('npm-api')();
var dependents = require('./');
npm.use(dependents());

var repo = npm.repo('micromatch');

// returns a Promise
repo.dependents()
  .then(function(repos) {
    console.log(repos);
  }, function(err) {
    console.error(err);
  });

// use with co
co(function* () {
  var repos = yield repo.dependents();
  console.log(repos);
});
