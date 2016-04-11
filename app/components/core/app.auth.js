(function() {
	"use strict";

	angular
		.module('bt.dashboard')
		.factory('AUTH', auth);


	auth.$inject = ['$rootScope', '$state', '$timeout', 'http', 'notification', 'store', 'i18n'];
	function auth($rootScope, $state, $timeout, http, note, store, _){
		/* jshint validthis:true */
		var vm = this;
		var account;
		var minTokenTTL = 60;
		return {
			authenticate: authenticate,
			checkHttpStatus: checkHttpStatus,
			isAdmin: isAdmin,
			isAuthenticated: isAuthenticated,
			logout: logout,
			redirect: redirect,
			refreshToken: refreshToken,
			saveToken: saveToken,
			showLogin: showLoginView,
			tryReauthentication: tryReauthentication,
		};

		/////////////////////

		function authenticate(login,pw, redirectUrl) {
			if(isAuthenticated()) {
				return true;
			} else {
				if(redirectUrl) { // used by external apps (TT & PL editor)
					vm.redirectUrl = redirectUrl;
				}
				account = store.get('account');
				if(account && account['api']) {
					$rootScope.ACCOUNT = account;
					$rootScope.API = account['api'];
				} else {
					$rootScope.API = $rootScope.DEFAULT_API; // README we use demo here because the API returns code 400 if the api is unknown
				}

				// try getting data with last call
				return http.post($rootScope.uriApiCms+'login', { 'api': $rootScope.API, 'p':{'login':login, 'pw':pw} })
				.then(_httpLoginSuccess, _httpLoginError);
			}
		}
		function tryReauthentication(redirectUrl) {
			if(isAuthenticated()) {
				// console.log("already authenticated");
				return true;
			} else {
				if(redirectUrl) { // used by external apps (TT & PL editor)
					vm.redirectUrl = redirectUrl;
				}
				var token_exp = parseInt(store.get('token_exp', true));
				var expiresIn = token_exp - (Date.now()/1000);
				var old_token = store.get('token', true);
				// console.log(token_exp, expiresIn,old_token);
				if(expiresIn < minTokenTTL || !old_token) {
					// console.log("token old or not found", old_token, token_exp, expiresIn);
					return false;
				}
				_startRefreshTimer(expiresIn);

				account = store.get('account');
				if(account && account['api']) {
					$rootScope.ACCOUNT = account;
					$rootScope.API = account['api'];
				} else {
					$rootScope.API = $rootScope.DEFAULT_API; // README we use demo here because the API returns code 400 if the api is unknown
				}

				// try getting data with last call
				return http.post($rootScope.uriApiCms+'getMe', { 'api': $rootScope.API })
				.then(_httpLoginSuccess, _httpReauthError);
			}
		}
		function isAuthenticated() {
			return !!$rootScope.ME && !!$rootScope.ME['user']['login'];
		}
		function isAdmin() {
			return !!$rootScope.ME && !!$rootScope.ME['user']['admin'];
		}
		function showLoginView(state,params) {
			if(state) {
				$rootScope.preAuthState = {state: state, params:params};
			} else {
				$rootScope.preAuthState = null;
			}
			// User isn’t authenticated
			// console.login
			$state.transitionTo("login");
		}
		function redirect(state, params, url) {
			if(url) {
				location.href = decodeURIComponent(url);
				return;
			}
			if($rootScope.preAuthState) {
				// check if we auto-transitioned here
				state = $rootScope.preAuthState.state;
				params = $rootScope.preAuthState.params;
				$rootScope.preAuthState = null;
			} else if(!state) {
				// if no state was passed to the funciton, fall back to default
				state = $rootScope.DEFAULT_ROUTE;
			}
			$state.transitionTo(state, params);
		}
		function logout(silent) {
			store.remove('token');
			store.remove('token_exp');
			$rootScope.ME = null;

			showLoginView();

			if(!silent) {
				note.ok('Logged out');
			}
		}
		function checkHttpStatus(response) {
			// console.info('checkHttpStatus',response.status, response.status == 401);
			if(response.status == 401 || response.status == 403) {
				logout();
			}
		}
		function saveToken(data) {
			if(!data['token']) {
				// if we did not get a token, something went wrong
				store.remove('token');
				store.remove('token_exp');
				// showLoginView();
				return false;
			}
			// get payload and decode it from Base64 to JSON
			var payload = JSON.parse( window.atob(data['token'].split('.')[1]) );
			var expiresIn = parseInt(payload['exp']) - parseInt(payload['iat']);

			store.set('token', data['token']);
			store.set('token_exp', payload['exp']);

			_startRefreshTimer(expiresIn);

			return true;
		}
		function refreshToken(){
			return http.post($rootScope.uriApiCms+'refreshToken', { 'api': $rootScope.API })
				.then(_httpRefreshSuccess, _httpReauthError);
		}


		/////////////////////


		function _httpLoginError(response) {
			_httpError(false,response);
		}
		function _httpReauthError(response) {
			_httpError(true,response);
		}
		function _httpError(silent, response) {
			if(response.status == 400) {
				// assume api is no longer in the system or user was deleted, remove account data from localStorage
				store.remove('account');
				// other requests will have failed as well - reload page to make sure everything is working correctly
				location.reload();
			} else {
				logout(true);

				if(!silent) {
					note.error(_('note_loginfailed'));
				}
			}
		}
		function _httpLoginSuccess(response, silent){
			var redirectUrl = vm.redirectUrl;
			vm.redirectUrl = false;

			var data = response.data;
			saveToken(data);
			$rootScope.ME = data;

			var ACCOUNTS = data['customers'];
			var account = store.get('account');
			var existing_account_valid = false;

			if(account && account['api']) {
				for (var i = ACCOUNTS.length - 1; i >= 0; i--) {
					if(ACCOUNTS[i]['api'] === account['api']) {
						$rootScope.API = ACCOUNTS[i]['api'];
						store.set('account', ACCOUNTS[i]);
						existing_account_valid = true;
						break;
					}
				}
			}
			if(!existing_account_valid) {
				$rootScope.API = ACCOUNTS[0]['api'];
				store.set('account', ACCOUNTS[0]);
				$rootScope.ACCOUNT = ACCOUNTS[0];
			}
			if(!silent) {
				note.ok(_('note_loggedinas',null,$rootScope.ME['user']['login']));
				redirect(false,false,redirectUrl);
			}
		}
		function _httpRefreshSuccess(response){
			var data = response.data;
			saveToken(data);
		}
		function _startRefreshTimer(expiresIn) {
			if($rootScope.refreshPromise) {
				$timeout.cancel($rootScope.refreshPromise);
			}
			// get refresh-token 1 minute before the old one is invalid (t-x is used to deal with latency)
			$rootScope.refreshPromise = $timeout(refreshToken, (expiresIn-minTokenTTL) * 1000);
		}
	}

})();
