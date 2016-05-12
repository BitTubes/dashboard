(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.controller('devController', devController);


	devController.$inject = ['$scope', '$interval', 'store', 'notification', 'Auth', 'elapsed'];
	/**
	 * angular-controller
	 *
	 * @param  {Object} $scope    [description]
	 * @param  {Object} $interval [description]
	 * @param  {Object} store     [description]
	 * @param  {Object} note      [description]
	 * @param  {Object} Auth      [description]
	 * @param  {Object} elapsed   [description]
	 * no @return
	 */
	function devController($scope, $interval, store, note, Auth, elapsed) {
		/* jshint validthis:true */
		var vm = this;
		vm.refresh = refresh;

		vm.token = null;
		vm.tokenExp = null;
		vm.expiresIn = '';
		// keep the following in scope to ease copy-paste of the sorting
		$scope.timerPromise = null;


		initView();


		/////////////////////


		/**
		 * get new token
		 *
		 * no @return
		 */
		function refresh() {
			Auth.refreshToken()
			.then(_updateUI);
		}


		/////////////////////


		/**
		 * retrieve data from localStorage and initiate view
		 *
		 * no @return
		 */
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
		/**
		 * set default vars
		 *
		 * @param  {Object} response
		 * @param  {boolean} [silent]   optionally surpresses the update notification
		 * no @return
		 */
		function _updateUI(response, silent) {
			vm.token = store.get('token');
			vm.tokenExp = store.get('token_exp');

			if(!silent) {
				note.info('Token refreshed');
			}
		}
		/**
		 * update the valid-until time in the view
		 *
		 * no @return
		 */
		function _updateTime() {
			vm.expiresIn = elapsed(vm.tokenExp * 1000);
		}

	}

})();
