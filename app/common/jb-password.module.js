(function() {
	'use strict';
	angular
		.module('jb.password', ['ngMessages'])
		.directive('jbBlacklist', blacklistDirective)
		.directive('jbNumber', numberDirective)
		.directive('jbLowercase', lowercaseDirective)
		.directive('jbUppercase', uppercaseDirective);

	/**
	 * directive
	 *
	 * @return {object}
	 */
	function blacklistDirective() {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: link
		};

		/**
		 * angular-directive link
		 *
		 * @param  {angularJs} scope
		 * @param  {angularJs} elem
		 * @param  {angularJs} attr
		 * @param  {angularJs} ngModel
		 * no @return
		 */
		function link(scope, elem, attr, ngModel) {
			var blacklist = attr.jbBlacklist.split(',');

			/**
			 * validates the input string against this filter
			 *
			 * @param  {string} value
			 * @return {string} returns the value initially provided
			 */
			function validate(value) {
				var validity = true;
				// expect angular to cast everything but null and undefined to 'string'
				// indexOf only works with strings, everything else would cause an error
				if(typeof(value) === 'string') {
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
	}
	/**
	 * directive
	 *
	 * @return {object}
	 */
	function numberDirective() {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: link
		};

		/**
		 * angular-directive link
		 *
		 * @param  {angularJs} scope
		 * @param  {angularJs} elem
		 * @param  {angularJs} attr
		 * @param  {angularJs} ngModel
		 * no @return
		 */
		function link(scope, elem, attr, ngModel) {
			/**
			 * validates the input string against this filter
			 *
			 * @param  {string} value
			 * @return {string} returns the value initially provided
			 */
			function validate(value) {
				ngModel.$setValidity('jbNumber', typeof(value) === 'string' && /[0-9]/.test(value));
				return value;
			}
			// view-to-model pipeline (manual changes via user input)
			ngModel.$parsers.unshift(validate);
			// model-to-view pipeline (programmatic changes to model via javascript)
			ngModel.$formatters.unshift(validate);
		}
	}
	/**
	 * directive
	 *
	 * @return {object}
	 */
	function lowercaseDirective() {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: link
		};

		/**
		 * angular-directive link
		 *
		 * @param  {angularJs} scope
		 * @param  {angularJs} elem
		 * @param  {angularJs} attr
		 * @param  {angularJs} ngModel
		 * no @return
		 */
		function link(scope, elem, attr, ngModel) {
			/**
			 * validates the input string against this filter
			 *
			 * @param  {string} value
			 * @return {string} returns the value initially provided
			 */
			function validate(value) {
				ngModel.$setValidity('jbLowercase', typeof(value) === 'string' && /[a-z]/.test(value));
				return value;
			}
			// view-to-model pipeline (manual changes via user input)
			ngModel.$parsers.unshift(validate);
			// model-to-view pipeline (programmatic changes to model via javascript)
			ngModel.$formatters.unshift(validate);
		}

	}
	/**
	 * directive
	 *
	 * @return {object}
	 */
	function uppercaseDirective() {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: link
		};

		/**
		 * angular-directive link
		 *
		 * @param  {angularJs} scope
		 * @param  {angularJs} elem
		 * @param  {angularJs} attr
		 * @param  {angularJs} ngModel
		 * no @return
		 */
		function link(scope, elem, attr, ngModel) {
			/**
			 * validates the input string against this filter
			 *
			 * @param  {string} value
			 * @return {string} returns the value initially provided
			 */
			function validate(value) {
				ngModel.$setValidity('jbUppercase', typeof(value) === 'string' && /[A-Z]/.test(value));
				return value;
			}
			// view-to-model pipeline (manual changes via user input)
			ngModel.$parsers.unshift(validate);
			// model-to-view pipeline (programmatic changes to model via javascript)
			ngModel.$formatters.unshift(validate);
		}
	}

})();
