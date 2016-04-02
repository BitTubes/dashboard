(function() {
	"use strict";
	angular
		.module('bittubes')
		.controller("forgotPwController", forgotPwController);


	forgotPwController.$inject = ['$stateParams', '$state', '$scope', '$rootScope', '$uibModal', '$interval', 'http','notification', 'AUTH', 'i18n'];
	function forgotPwController($stateParams, $state, $scope, $rootScope, $uibModal, $interval, http, note, Auth, _) {
		/* jshint validthis:true */
		var vm = this;
		vm.login = null;
		vm.pw = null;
		vm.resetToken = $stateParams.token || false;
		vm.sendData = sendData;
		vm.showLogin = false;
		vm.showPassword = false;
		vm.spinning = true;
		vm.updatePossible = false;


		if(vm.resetToken) {
			_resetTokenTest(vm.resetToken);
		} else {
			vm.showLogin = true;
			vm.spinning = false;
		}



		$scope.timerPromise = $interval(Auth.tryReauthentication.bind(Auth, false), 1000);
		$scope.$on("$destroy",function(){
			if (angular.isDefined($scope.timerPromise)) {
				$interval.cancel($scope.timerPromise);
			}
		});




		function sendData() {
			if(vm.showLogin && vm.login) {
				_resetTokenGet(vm.login);
			} else if(vm.showPassword && vm.pw && vm.resetToken) {
				_resetPassword(vm.resetToken, vm.pw);
			}
		}

		function _resetTokenGet(login) {
			return http.post($rootScope.uriApiCms+'sendResetToken', { 'api': $rootScope.DEFAULT_API, 'p':{'login':login, 'locale': $rootScope.locale} })
			.then(function(response){
				if(response.data['error']) {
					_resetState(_('fpw_err_send'));
					return;
				}
				vm.showLogin = false;
				vm.showPassword = false;
				vm.spinning = true;

				$scope.email = vm.login;
				$uibModal.open({
					animation: true,
					// template: '<div class="modal-body"><div class="alert alert-success" role="alert">'+msg+'</div></div>',
					templateUrl: 'components/core/forgotpw-200.html',
					scope: $scope,
					backdrop: 'static', // disables modal from being closed by clicking on the background
					// size: 'lg'
				});
			},
			function(){
				_resetState(_('fpw_err_send'));
				// _modeLogin();
				// note.error('Could not send reset e-mail. Please check your login and try again.');
			});
		}
		function _resetPassword(token, pw) {
			return http.post($rootScope.uriApiCms+'resetPassword', { 'api': $rootScope.DEFAULT_API, 'p':{'token':token, 'pw':pw} })
			.then(function(response){
				if(response.data !== true) {
					_resetState(_('fpw_err_reset'));
					return;
				}
				// hide form
				vm.showLogin = false;
				vm.showPassword = false;
				vm.spinning = true;
				note.ok(_('fpw_reset_done'));
				// try to authenticate which should work fine and sign in user
				Auth.authenticate(vm.login,pw);
			},
			function(){
				_resetState(_('fpw_err_reset'));
				// _modeLogin();
				// note.error('Could not send reset your password. This was probably caused by an outdated update-link. Please try again');
			});
		}
		function _resetTokenTest(token) {
			http.post($rootScope.uriApiCms+'testResetToken', { 'api': $rootScope.DEFAULT_API, 'p':{'token':token} })
			.then(function(response){
				vm.login = response.data['login'];
				if(vm.login) {
					_modePassword();
				} else {
					_resetState(_('fpw_err_token'));
					// _modeLogin();
					// note.warn(_('fpw_err_token'));
				}
				// console.info('_resetTokenTest','success');
			},
			function(){
				_resetState(_('fpw_err_token'));
				// _modeLogin();
				// note.warn('Reset Token invalid - please request new token.');
				// console.warn('_resetTokenTest','fail');
			});
		}


		// function _modeLogin() {
		// 	vm.login = null;
		// 	vm.pw = null;
		// 	vm.resetToken = false;
		// 	vm.showLogin = true;
		// 	vm.showPassword = false;

		// 	vm.spinning = false;
		// }
		function _modePassword() {
			vm.pw = null;
			vm.showLogin = false;
			vm.showPassword = true;
			
			vm.spinning = false;
		}
		function _resetState(warning) {
			$state.transitionTo($state.current, {}, {reload:true});
			// _modeLogin();
			note.warn(warning);
		}
	}

})();