/*!
 * npm-api-dependents <https://github.com/doowb/npm-api-dependents>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function(config) {
  return function plugin(app) {
    if (!this.isNpmapi) return;

    return function() {
      if (!this.isRepo) return;

      /**
       * Get the dependents for the current repo.
       *
       * ```js
       * var repo = npm.repo('micromatch');
       *
       * // returns a readable stream
       * repo.dependents()
       *   .on('data', function(repo) {
       *     console.log(repo);
       *   });
       * ```
       * @name .dependents
       * @param  {Object}  `options` Options to handle returned results
       * @return {Stream}  Returns a readable stream (object mode).
       * @api public
       */

      this.define('dependents', function(options) {
        var opts = utils.extend({}, options);
        var view = app.view('dependedUpon');
        var stream = view.stream({
          group_level: 2,
          startkey: JSON.stringify([this.name]),
          endkey: JSON.stringify([this.name, {}])
        });
        var transform = utils.through2.obj(function (obj, enc, cb) {
          var dependent = obj.key[1];
          this.push(app.repo(dependent));
          cb();
        });
        return stream.pipe(transform);
      });
    };
  };
};
