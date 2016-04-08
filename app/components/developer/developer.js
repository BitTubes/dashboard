(function() {
	"use strict";
	angular
		.module('bt.dashboard')
		.controller('devController', devController);


	devController.$inject = ['store','$scope','i18n','notification','AUTH', 'elapsed', '$interval'];
	function devController(store, $scope, _, note, Auth, elapsed, $interval) {
		/* jshint validthis:true */
		// note.debug("i18n missing");
		var vm = this;
		vm.refresh = refresh;
		// vm.refreshPromise = null;

		vm.token = null;
		vm.token_exp = null;
		vm.expiresIn = "";
		// keep the following in scope to ease copy-paste of the sorting
		$scope.timerPromise = null;
		// $scope.orderByField = 'Name';
		// $scope.reverseSort = false;


		initView();


		/////////////////////


		function refresh() {
			Auth.refreshToken()
			.then(_updateUI);
		}


		/////////////////////


		function initView() {
			_updateUI(null,true);
			
			_updateTime();
			$scope.timerPromise = $interval(_updateTime, 1000);
			$scope.$on("$destroy",function(){
				if (angular.isDefined($scope.timerPromise)) {
					$interval.cancel($scope.timerPromise);
				}
			});
		}
		function _updateUI(response,silent) {

			// vm.refreshPromise = null;
			vm.token = store.get('token');
			vm.token_exp = store.get('token_exp');

			if(!silent) {
				note.info("Token refreshed");
			}
		}
		function _updateTime() {
			vm.expiresIn = elapsed(vm.token_exp*1000);
			// console.log('_updateTime');
		}

	}

})();