'use strict';

var npm = require('npm-api')();
var dependents = require('../');
npm.use(dependents());

var repo = npm.repo('micromatch');

// returns a Promise
repo.dependents()
  .then(function(repos) {
    console.log(repos);
  }, function(err) {
    console.error(err);
  });

