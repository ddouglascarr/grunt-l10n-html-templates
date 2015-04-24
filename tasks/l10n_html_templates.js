/*
 * grunt-l10n-html-templates
 * https://github.com/danielwork/grunt-l10n-html-templates
 *
 * Copyright (c) 2015 Daniel Carr
 * Licensed under the MIT license.
 */

'use strict';

var l10n = require('l10n-html');
var fs = require('fs');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('l10n_html_templates', 'iterates over html template files creating localised files', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });
    console.log(options);
    console.log(this.files);
    console.log(this.locales);

    var locales = options.locales;

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function(filepath) {
        var _path = filepath.split('/');
        var filename = _path.pop();
        var path = _path.join('/') + '/';
        
        var html = fs.readFileSync(filepath, {encoding:'utf8'});

        locales.forEach(function(locale) {
            var _json, json;
            try {
                _json = fs.readFileSync(path + locale + '.json', {encoding:'utf8'});
                json = JSON.parse(_json);
            } catch(e) {
                console.log('no local file for ' + locale + ' at ' + path);
                json = {};
            }
            var out = l10n(html, json, {stripDataAttributes: true});
            var out_filename = path + filename +  '.' + locale;
            fs.writeFileSync(out_filename, out, {encoding:'utf8'});
            console.log(out_filename + ' written');
        });
      });
    });
  });

};


