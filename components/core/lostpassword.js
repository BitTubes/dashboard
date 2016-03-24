(function() {
	"use strict";
	angular
		.module('bittubes')
		.controller("lostController", lostController);


	lostController.$inject = ['$stateParams', 'AUTH', '$scope', '$interval'];
	function lostController($stateParams, Auth, $scope, $interval) {
		/* jshint validthis:true */
		var vm = this;
		var resetToken = $stateParams.token || false;
		vm.login = null;
		vm.pw = null;
		// vm.spinning = true;
		// vm.authenticate = function() {
		// 	Auth.authenticate(vm.login,vm.pw, redirectUrl);
		// };

		// vm.tryReauthPromise = Auth.tryReauthentication(redirectUrl);

		// if(!vm.tryReauthPromise) {
		// 	vm.spinning=false;
		// } else {
		// 	vm.tryReauthPromise.then(function(){
		// 		// login success, dont hide the loader
		// 	},
		// 	function(){
		// 		// login failed, show the form
		// 		vm.spinning=false;
		// 	});
		// }

		// $scope.timerPromise = $interval(Auth.tryReauthentication.bind(Auth, redirectUrl), 1000);
		// $scope.$on("$destroy",function(){
		// 	if (angular.isDefined($scope.timerPromise)) {
		// 		$interval.cancel($scope.timerPromise);
		// 	}
		// });
	}

})();