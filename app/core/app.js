(function() {
	'use strict';
	// var app = angular.module('btCms', [ 'filterElapsed', 'jbServices', 'ngRoute' ]);
	angular.module('bt.dashboard', ['jb.services', 'jb.notification', 'jb.i18n', 'jb.password', 'ui.router','ui.bootstrap', 'ngMessages', 'ngAnimate', 'angular-storage', 'ng-showdown'])

	.config(function($animateProvider) {
		$animateProvider.classNameFilter(/angular-animate/);
	});



})();
