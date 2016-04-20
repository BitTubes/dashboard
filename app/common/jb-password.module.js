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
				var blacklist = attr.jbBlacklist.split(',');
				function validate(value) {
					ngModel.$setValidity('jbBlacklist', blacklist.indexOf(value) === -1);
					return value;
				}
				// view-to-model pipeline (manual changes via user input)
				ngModel.$parsers.unshift(validate);
				// model-to-view pipeline (programmatic changes to model via javascript)
				ngModel.$formatters.unshift(validate);
			}
		};
	}
	function numberDirective(){
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elem, attr, ngModel) {
				function validate(value) {
					console.log("number",/[0-9]/.test(value));
					ngModel.$setValidity('jbNumber', /[0-9]/.test(value));
					return value;
				}
				// view-to-model pipeline (manual changes via user input)
				ngModel.$parsers.unshift(validate);
				// model-to-view pipeline (programmatic changes to model via javascript)
				ngModel.$formatters.unshift(validate);
			}
		};
	}
	function lowercaseDirective(){
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elem, attr, ngModel) {
				function validate(value) {
					console.log("lowercase",/[a-z]/.test(value));
					ngModel.$setValidity('jbLowercase', /[a-z]/.test(value));
					return value;
				}
				// view-to-model pipeline (manual changes via user input)
				ngModel.$parsers.unshift(validate);
				// model-to-view pipeline (programmatic changes to model via javascript)
				ngModel.$formatters.unshift(validate);
			}
		};
	}
	function uppercaseDirective(){
		return {
			require: 'ngModel',
			restrict: 'A',
			link: function(scope, elem, attr, ngModel) {
				function validate(value) {
					console.log("uppercase",/[A-Z]/.test(value));
					ngModel.$setValidity('jbUppercase', /[A-Z]/.test(value));
					return value;
				}
				// view-to-model pipeline (manual changes via user input)
				ngModel.$parsers.unshift(validate);
				// model-to-view pipeline (programmatic changes to model via javascript)
				ngModel.$formatters.unshift(validate);
			}
		};
	}

})();
