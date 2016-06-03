(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.directive('btFooter', footerDirective)
		.controller('FooterController', FooterController);


	FooterController.$inject = ['$scope'];
	function FooterController($scope) {
		$scope.date = new Date();
	}

	function footerDirective() {
		return {
			restrict: 'E',
			templateUrl: 'core/footer.html',
			controller: 'FooterController',
			controllerAs: 'footer'
		};
	}
})();
