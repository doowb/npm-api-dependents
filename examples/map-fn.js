'use strict';

var co = require('co');
var npm = require('npm-api')();
var dependents = require('../');
npm.use(dependents());

var repo = npm.repo('micromatch');

// use with co
co(function* () {
  var repos = yield repo.dependents({
    /**
     * Use a custom function to transform the repo name
     * into a `Repo` object from `npm-api`
     */
    mapFn: function(name) {
      return this.repo(name);
    }
  });
  console.log(repos);
});

