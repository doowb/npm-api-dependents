'use strict';

var npm = require('npm-api')();
var through2 = require('through2');
var dependents = require('../');
npm.use(dependents());

var repo = npm.repo('micromatch');
repo.dependents().pipe(through2.obj(function (obj, enc, cb) {
  this.push(obj.name + '\n');
  cb();
})).pipe(process.stdout);
