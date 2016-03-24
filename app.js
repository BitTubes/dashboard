(function() {
	"use strict";
	// var app = angular.module('btCms', [ 'filterElapsed', 'jbServices', 'ngRoute' ]);
	angular.module('bittubes', ['jb.services', 'jb.notification', 'jb.i18n', 'ui.router','ui.bootstrap', 'ngMessages', 'ngAnimate', 'angular-storage' ])

	.config(function($animateProvider) {
		$animateProvider.classNameFilter(/angular-animate/);
	});



})();