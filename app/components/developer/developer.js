(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.controller('devController', devController);


	devController.$inject = ['store','$scope','notification','Auth', 'elapsed', '$interval'];
	function devController(store, $scope, note, Auth, elapsed, $interval) {
		/* jshint validthis:true */
		// note.debug("i18n missing");
		var vm = this;
		vm.refresh = refresh;
		// vm.refreshPromise = null;

		vm.token = null;
		vm.tokenExp = null;
		vm.expiresIn = '';
		// keep the following in scope to ease copy-paste of the sorting
		$scope.timerPromise = null;


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
			$scope.$on('$destroy',function() {
				if (angular.isDefined($scope.timerPromise)) {
					$interval.cancel($scope.timerPromise);
				}
			});
		}
		function _updateUI(response, silent) {
			vm.token = store.get('token');
			vm.tokenExp = store.get('token_exp');

			if(!silent) {
				note.info('Token refreshed');
			}
		}
		function _updateTime() {
			vm.expiresIn = elapsed(vm.tokenExp * 1000);
			// console.log('_updateTime');
		}

	}

})();
