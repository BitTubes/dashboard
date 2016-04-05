(function() {
	"use strict";
	angular
		.module('bittubes')
		.directive("btFooter", footerDirective)
		.controller("footerController", footerController);


	footerController.$inject = ['$scope'];
	function footerController($scope) {
		$scope.date = new Date();
	}

	function footerDirective() {
		return {
			restrict: "E",
			templateUrl: "components/core/footer.html",
			controller: 'footerController',
			controllerAs: 'footer'
		};
	}
})();