(function() {
	"use strict";
	angular
		.module('jb.password', ['ngMessages'])
		.directive('jbBlacklist', blacklistDirective)
		.directive('jbNumber', numberDirective)
		.directive('jbLowercase', lowercaseDirective)
		.directive('jbUppercase', uppercaseDirective);

	function blacklistDirective(){
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elem, attr, ngModel) {
				var blacklist = attr.blacklist.split(',');
				ngModel.$parsers.unshift(function (value) {
					ngModel.$setValidity('jbBlacklist', blacklist.indexOf(value) === -1);
					return value;
				});
			}
		};
	}
	function numberDirective(){
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elem, attr, ngModel) {
				ngModel.$parsers.unshift(function (value) {
					console.log("number",/[0-9]/.test(value));
					ngModel.$setValidity('jbNumber', /[0-9]/.test(value));
					return value;
				});
			}
		};
	}
	function lowercaseDirective(){
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elem, attr, ngModel) {
				ngModel.$parsers.unshift(function (value) {
					console.log("lowercase",/[a-z]/.test(value));
					ngModel.$setValidity('jbLowercase', /[a-z]/.test(value));
					return value;
				});
			}
		};
	}
	function uppercaseDirective(){
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elem, attr, ngModel) {
				ngModel.$parsers.unshift(function (value) {
					console.log("uppercase",/[A-Z]/.test(value));
					ngModel.$setValidity('jbUppercase', /[A-Z]/.test(value));
					return value;
				});
			}
		};
	}

})();
