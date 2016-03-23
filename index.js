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
       * // returns a promise
       * repo.dependents()
       *   .then(function(repos) {
       *     console.log(repos);
       *   }, function(err) {
       *     console.error(err);
       *   });
       *
       * // use with co and generator functions
       * co(function* () {
       *   var repos = yield repo.dependents();
       *   console.log(repos);
       * });
       * ```
       * @name .dependents
       * @param  {Object}   `options` Options to handle returned results
       * @param  {Function} `options.mapFn` Optional map function to handle transforming the repo name into something else. Takes `(name, index, repos, options)` and called in the context of the [npm-api][] instance.
       * @return {Promise}  Returns an array of module names when promise resolves.
       * @api public
       */

      this.define('dependents', function(options) {
        var opts = utils.extend({}, options);
        return utils.co(function* () {
          var view = app.view('dependedUpon');
          var results = yield view.query({
            group_level: 2,
            startkey: JSON.stringify([this.name]),
            endkey: JSON.stringify([this.name, {}])
          });

          return results.map(function(result, i) {
            var key = result.key[1];
            if (typeof opts.mapFn === 'function') {
              return opts.mapFn.call(app, key, i, results, options);
            }
            return key;
          });

        }.bind(this));
      });
    };
  };
};
