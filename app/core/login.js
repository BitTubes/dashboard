(function() {
	"use strict";
	angular
		.module('bt.dashboard')
		.controller("loginController", loginController);


	loginController.$inject = ['$stateParams', 'Auth', '$scope', '$interval'];
	function loginController($stateParams, Auth, $scope, $interval) {
		/* jshint validthis:true */
		var vm = this;
		var redirectUrl = $stateParams.redirect || false;
		vm.login = null;
		vm.promise = null;
		vm.pw = null;
		vm.spinning = true;
		vm.authenticate = function() {
			vm.promise = Auth.authenticate(vm.login,vm.pw, redirectUrl);
		};

		vm.tryReauthPromise = Auth.tryReauthentication(redirectUrl);

		if(!vm.tryReauthPromise) {
			vm.spinning=false;
		} else {
			vm.tryReauthPromise.then(function(){
				// login success, dont hide the loader
			},
			function(){
				// login failed, show the form
				vm.spinning=false;
			});
		}

		$scope.timerPromise = $interval(Auth.tryReauthentication.bind(Auth, redirectUrl), 1000);
		$scope.$on("$destroy",function(){
			if (angular.isDefined($scope.timerPromise)) {
				$interval.cancel($scope.timerPromise);
			}
		});
	}

})();
