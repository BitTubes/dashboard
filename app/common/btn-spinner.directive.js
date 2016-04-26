(function() {
	'use strict';

	angular.module('bt.dashboard')
		.directive('btnSpinner', btnSpinner);
		// .directive('spinnerController', ['$scope',spinnerController]);

	btnSpinner.$inject = ['$q'];
	/**
	 *
	 * Displays a loading spinner on a button if a promise or boolean is passed to it.
	 *
	 * @memberof portal.util
	 * @name btnSpinner
	 * @param $q     {service}   $q service
	 *
	 */
	function btnSpinner($q) {
		var directive = {
			link: link,
			restrict: 'A',
			transclude: true,
			templateUrl: 'common/btn-spinner.html',
			scope: {
				btnSpinner: '=',
				disabled: '=?ngDisabled'
			}
		};
		return directive;

		/**
		 *
		 * Prepends a loading spinner to the button depending on the state of the bound variable.
		 *
		 * @memberof btnSpinner
		 * @param scope       {scope}     the assigned scope
		 * @param element     {element}   the element the directive is linked to
		 * @param attrs       {attrs}     attributes passed to the directive
		 */
		function link(scope, element, attrs) {
			// var spinner = angular.element('<span class="icons icons-spinner glyph-spin"></span>');
			scope.spinning = false;

			scope.$watch('btnSpinner', function(loading) {
				if (!loading) {
					return resolved();
				}

				if (!scope.spinning) {
					scope.spinning = true;

					// disable the button
					element.prop('disabled', true);

					if (typeof loading === 'object') {
						$q.resolve(loading).then(resolved, resolved);
					}
				}
			});
			// watches ng-disabled
			scope.$watch('disabled', handleNgDisabled);

			/**
			 *
			 * Removes the loading spinner and resets the button.
			 *
			 * @memberof btnSpinner
			 */
			function resolved() {
				scope.spinning = false;

				// enable the button
				element.prop('disabled', false);

				// reevaluate ng-disabled
				handleNgDisabled();
			}
			/**
			 *
			 * Evaluates ng-disabled.
			 *
			 * @memberof btnSpinner
			 */
			function handleNgDisabled() {
				if (attrs.ngDisabled) {
					element.prop('disabled', scope.disabled);
				}
			}

		}
	}
})();
