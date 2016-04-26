(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.controller('deleteModalCtrl', deleteModalCtrl);


	deleteModalCtrl.$inject = ['$scope', '$uibModalInstance'];
	function deleteModalCtrl($scope, $uibModalInstance) {
		$scope.ok = function() {
			$uibModalInstance.close($scope.delObj);
		};

		$scope.cancel = function() {
			$uibModalInstance.dismiss();
		};
	}

})();
