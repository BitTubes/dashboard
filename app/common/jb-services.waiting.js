(function() {
	"use strict";
	angular
		.module('jb.services')
		.factory('waiting', waitingFactory);



	waitingFactory.$inject = ['$uibModal', '$rootScope'];
	function waitingFactory($uibModal, $rootScope){
		/* jshint validthis:true */
		// var vm = this;
		var modalInstance = null;
		var scope = $rootScope.$new();
		scope.msg_waiting = null;
		scope.msg_taketime = null;


		return {
			hide : hide,
			show : show,
			_test: {
				get modalInstance(){ return modalInstance; }
			}
		};


		///////////////////////////////


		function show(msg_waiting, msg_taketime) {
			scope.msg_waiting = msg_waiting;
			scope.msg_taketime = msg_taketime;

			modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/waiting.html',
				backdrop: 'static', // disables modal from being closed by clicking on the background
				scope: scope,
				size: 'lg'
			});
		}
		function hide() {
			modalInstance.close();
		}
	}
})();


