(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.controller('deleteModalCtrl', deleteModalCtrl);


	deleteModalCtrl.$inject = ['$scope', '$uibModalInstance'];
	/**
	 * controller
	 *
	 * @param  {angularJs} $scope
	 * @param  {angularJs} $uibModalInstance
	 * no @return
	 */
	function deleteModalCtrl($scope, $uibModalInstance) {
		$scope.ok = ok;
		$scope.cancel = cancel;


		///////////////////////


		/**
		 * called when OK button is pressed
		 *
		 * no @return
		 */
		function ok() {
			$uibModalInstance.close($scope.delObj);
		}

		/**
		 * called when CANCEL button is pressed
		 *
		 * no @return
		 */
		function cancel() {
			$uibModalInstance.dismiss();
		}
	}

})();
