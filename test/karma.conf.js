// Karma configuration
// Generated on 2016-04-08

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/showdown/dist/showdown.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/ng-showdown/dist/ng-showdown.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/**/*.html',
      'app/core/app.js',
      'app/**/*.module.js',
      'app/locales/jb-i18n_de.js',
      'app/lib/angular-storage.js',
      'app/core/**/*.js',
      'app/common/**/*.js',
      'app/components/**/*.js',
      // 'app/locales/**/*.js',
      'test/mock/**/*.mock.js',
      'test/spec/**/*.spec.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
			'PhantomJS'
    ],

    // Which plugins to enable
    // plugins: [
    //   'karma-phantomjs-launcher',
    //   'karma-jasmine',
    //   'karma-coverage',
    //   'karma-ng-html2js-preprocessor',
    //   'karma-spec-reporter',
    // ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'

    ////////////////////////////////////////////////////////
    ///
    /// preprocessors
    ///
    preprocessors: {
			// source files, that you wanna generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
			'app/**/*.js': ['coverage'],
			'app/**/*.html': ['ng-html2js']
    },

    reporters: [
    	// 'progress',
    	'coverage',
    	// 'spec',
    	'mocha',
    ],

    ////////////////////////////////////////////////////////
    ///
    /// karma-coverage
    ///
    // coverage reporter generates the coverage

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : '.tmp/coverage/'
    },

    //////////////////////////////////////////////////////
    ///
    /// ng-html2js-preprocessor
    ///
    ngHtml2JsPreprocessor: {
			// strip this from the file path
			stripPrefix: 'app/',
			// stripSuffix: '.ext',
			// prepend this to the
			// prependPrefix: 'app/',

			// or define a custom transform function
			// - cacheId returned is used to load template
			//   module(cacheId) will return template at filepath
			// cacheIdFromPath: function(filepath) {
			// 	// example strips 'public/' from anywhere in the path
			// 	// module(app/templates/template.html) => app/public/templates/template.html
			// 	var cacheId = filepath.strip('public/', '');
			// 	return cacheId;
			// },

			// - setting this option will create only a single module that contains templates
			//   from all the files, so you can load them all with module('foo')
			// - you may provide a function(htmlPath, originalPath) instead of a string
			//   if you'd like to generate modules dynamically
			//   htmlPath is a originalPath stripped and/or prepended
			//   with all provided suffixes and prefixes
			moduleName: 'my.templates'
    },

    //////////////////////////////////////////////////////
    ///
    /// karma-spec-reporter
    ///
		// specReporter: {
		// 	// maxLogLines: 5,         // limit number of lines logged per test
		// 	suppressErrorSummary: false,  // do not print error summary
		// 	suppressFailed: false,  // do not print information about failed tests
		// 	suppressPassed: false,  // do not print information about passed tests
		// 	suppressSkipped: false,  // do not print information about skipped tests
		// 	showSpecTiming: true // print the time elapsed for each spec
		// },

    //////////////////////////////////////////////////////
    ///
    /// karma-mocha-reporter
    ///
		mochaReporter: {
			// output: 'full', // https://github.com/litixsoft/karma-mocha-reporter#output
      // colors: {
      //   success: 'green',
      //   info: 'grey',
      //   warning: 'yellow',
      //   error: 'red'
      // }
    },
  });
};
