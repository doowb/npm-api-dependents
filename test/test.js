'use strict';

require('mocha');
var Npm = require('npm-api');
var assert = require('assert');

var dependents = require('..');

describe('npm-api-dependents', function() {
  it('should export a function', function() {
    assert.equal(typeof dependents, 'function');
  });

  it('should add a `.dependents` method to `Repo` instances', function() {
    var npm = new Npm();
    npm.use(dependents());

    var micromatch = npm.repo('micromatch');
    assert.equal(typeof micromatch.dependents, 'function');
  });

  it('should stream dependents as `Repo` instances', function(cb) {
    this.timeout(5000);
    var npm = new Npm();
    npm.use(dependents());

    var count = 0;
    var micromatch = npm.repo('micromatch');
    micromatch.dependents()
      .on('data', function(dependent) {
        assert.equal(typeof dependent, 'object');
        assert(dependent instanceof npm.Repo, 'Expected dependent to be an instance of Repo');
        count++;
      })
      .once('error', cb)
      .once('end', function() {
        assert(count > 0, 'Expected count to be greater than 0');
        cb();
      });
  });

  it('should stream dependents as raw objects with a name property when `options.raw` is `true`', function(cb) {
    this.timeout(5000);
    var npm = new Npm();
    npm.use(dependents());

    var count = 0;
    var micromatch = npm.repo('micromatch');
    micromatch.dependents({raw: true})
      .on('data', function(dependent) {
        assert.equal(typeof dependent, 'object');
        assert.equal(dependent instanceof npm.Repo, false);
        assert.equal(typeof dependent.name, 'string');
        count++;
      })
      .once('error', cb)
      .once('end', function() {
        assert(count > 0, 'Expected count to be greater than 0');
        cb();
      });
  });
});
