(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.directive('btFooter', footerDirective)
		.controller('footerController', footerController);


	footerController.$inject = ['$scope'];
	function footerController($scope) {
		$scope.date = new Date();
	}

	function footerDirective() {
		return {
			restrict: 'E',
			templateUrl: 'core/footer.html',
			controller: 'footerController',
			controllerAs: 'footer'
		};
	}
})();
