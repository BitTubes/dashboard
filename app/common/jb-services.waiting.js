(function() {
	'use strict';
	angular
		.module('jb.services')
		.factory('waiting', waitingFactory);



	waitingFactory.$inject = ['$uibModal', '$rootScope'];
	/**
	 * factory
	 *
	 * @param  {angularJs} $uibModal
	 * @param  {angularJs} $rootScope
	 * @return {service}
	 */
	function waitingFactory($uibModal, $rootScope) {
		/* jshint validthis:true */
		// var vm = this;
		var modalInstance = null;
		var scope = $rootScope.$new();
		scope.msgWaiting = null;
		scope.msgTaketime = null;


		return {
			hide: hide,
			show: show,
			_test: {
				get modalInstance() { return modalInstance; }
			}
		};


		///////////////////////////////


		/**
		 * show the waiting modal
		 *
		 * @param  {string} msgWaiting  - the title of the modal
		 * @param  {string} msgTaketime - the message displayed
		 * no @return
		 */
		function show(msgWaiting, msgTaketime) {
			scope.msgWaiting = msgWaiting;
			scope.msgTaketime = msgTaketime;

			modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/waiting.html',
				backdrop: 'static', /* disables modal from being closed by clicking on the background */
				scope: scope,
				size: 'lg'
			});
		}
		/**
		 * hide the modal again
		 *
		 * no @return
		 */
		function hide() {
			modalInstance.close();
		}
	}
})();


