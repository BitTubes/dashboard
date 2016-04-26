(function() {
	'use strict';
	angular
		.module('jb.services')
		.factory('waiting', waitingFactory);



	waitingFactory.$inject = ['$uibModal', '$rootScope'];
	function waitingFactory($uibModal, $rootScope) {
		/* jshint validthis:true */
		// var vm = this;
		var modalInstance = null;
		var scope = $rootScope.$new();
		scope.msgWaiting = null;
		scope.msgTaketime = null;


		return {
			hide : hide,
			show : show,
			_test: {
				get modalInstance() { return modalInstance; }
			}
		};


		///////////////////////////////


		function show(msgWaiting, msgTaketime) {
			scope.msgWaiting = msgWaiting;
			scope.msgTaketime = msgTaketime;

			modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/waiting.html',
				backdrop: 'static', // README disables modal from being closed by clicking on the background
				scope: scope,
				size: 'lg'
			});
		}
		function hide() {
			modalInstance.close();
		}
	}
})();


