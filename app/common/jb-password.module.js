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
					var validity = true;
					// expect angular to cast everything but null and undefined to "string"
					// indexOf only works with strings, everything else would cause an error
					if(typeof(value)==="string") {
						for (var i = blacklist.length - 1; i >= 0; i--) {
							validity = validity && (value.indexOf(blacklist[i]) === -1);
							if(!validity) {
								break;
							}
						}
					}
					ngModel.$setValidity('jbBlacklist', validity);
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
					ngModel.$setValidity('jbNumber', typeof(value)==="string" && /[0-9]/.test(value));
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
					ngModel.$setValidity('jbLowercase', typeof(value)==="string" && /[a-z]/.test(value));
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
					ngModel.$setValidity('jbUppercase', typeof(value)==="string" && /[A-Z]/.test(value));
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
