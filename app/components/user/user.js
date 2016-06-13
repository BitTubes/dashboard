(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.controller('UserController', UserController)
		.controller('UserEditModalController', UserEditModalController)
		.controller('UserAdminModalController', UserAdminModalController);


	UserController.$inject = ['http', '$stateParams', '$scope', '$rootScope', '$uibModal', 'i18n', 'notification', 'Auth', '$state'];
	function UserController(http, $stateParams, $scope, $rootScope, $uibModal, _, note, Auth, $state) {
		/* jshint validthis:true */
		var vm = this;
		var editMe = ($stateParams.editme === 'me');
		vm.add = add;
		vm.admin = admin;
		vm.delete = del;
		vm.edit = edit;
		vm.USERS = null;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.loadPromise = null;
		$scope.reload = initView;
		$scope.orderByField = 'ID';
		$scope.reverseSort = true;


		initView();


		/////////////////////


		function add() {
			$scope.ADD = 1;
			$scope.user = {login: ''};

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/user/user.edit.html',
				controller: 'UserEditModalController',
				controllerAs: 'userEditModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(_addDb, _modalDismissed);
		}
		function del(user) {
			$scope.delObj = user;
			$scope.deleteWarning = user['login'] === $rootScope.ME['user']['login'];
			$scope.formDisabled = user['admin'] && !$rootScope.ME['user']['admin'];
			$scope.Name = user['login'];
			$scope.title = _('user', 1);

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/del.html',
				controller: 'DeleteModalController',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(_delDb, _modalDismissed);
		}
		function edit(user) {
			$scope.ADD = 0;
			$scope.editWarning = user['login'] === $rootScope.ME['user']['login'];
			$scope.formDisabled = user['admin'] && !$rootScope.ME['user']['admin'];
			$scope.user = user;

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/user/user.edit.html',
				controller: 'UserEditModalController',
				controllerAs: 'userEditModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(_editDb, _modalDismissed);
		}
		function admin(user) {
			if(!$rootScope.ME['user']['admin']) {
				return; /* failsafe */
			}
			$scope.editWarning = user['login'] === $rootScope.ME['user']['login'];
			$scope.formDisabled = $rootScope.API != 'dev';
			$scope.user = user;

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/user/user.admin.html',
				controller: 'UserAdminModalController',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(_adminDb, _modalDismissed);
		}


		/////////////////////


		function initView() {
			$scope.loadPromise = http.post($scope.uriApiCms + 'getUsers', {'api': $scope.API, 'p': {times: 1}})
			.then(function(response) {
				var data = response.data;
				vm.USERS = data;

				if(editMe) {
					vm.edit($rootScope.ME['user']);
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _modalDismissed() {
			if(editMe) {
				// console.log("reroute to default users list");
				$state.transitionTo('users');
			}
			// console.info('Modal dismissed at: ' + new Date());
		}
		function _addDb(scope) {
			// update DB
			http.post($scope.uriApiCms + 'addUser', {
				'api': $scope.API,
				'p': {
					'login': scope.newLogin,
					// 'pw': scope.newPasswd
					'locale': $rootScope.locale
				}
			})
			.then(function(response) {
				var data = response.data;
				if(!data['ID']) {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				} else {
					vm.USERS.push(data);
				}
				note.ok(_('note_xadded', 0, _('user', 1) + ' ' + data['login']));
				// remove from UI
				// var tr = document.getElementById('user'+user['ID']);
				// tr.parentNode.removeChild(tr);
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _editDb(scope) {
			// console.log('ok', newLogin, newPasswd);
			// console.log('ok2', scope.newLogin, scope.newPasswd);
			var user = scope.user;

			// update DB
			http.post($scope.uriApiCms + 'updateUser', {
				'api': $scope.API,
				'p': {
					'ID': user['ID'],
					'login': scope.newLogin,
					'pw': scope.newPasswd
				}
			})
			.then(function(response) {
				var data = response.data;
				if(!data['user']) {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				user['login'] = data['user']['login'];

				note.ok(_('note_pwupdated', 0, user['login']));


				// I changed my own password - re-init entire UI
				if($rootScope.ME['user']['ID'] === user['ID']) {
					$rootScope.ME['user']['login'] = user['login'];
					Auth.saveToken(data);
					// $timeout(function() {
					// 	location.reload();
					// },3000);
					if(editMe) {
						// console.log("reroute to default users list");
						$state.transitionTo('users');
					}
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _adminDb(scope) {
			// console.log('ok', newLogin, newPasswd);
			// console.log('ok2', scope.newLogin, scope.newPasswd);
			var user = scope.user;

			if($rootScope.API != 'dev') {
				return;
			}

			// update DB
			http.post($scope.uriApiCms + 'updateAdmin', {
				'api': $scope.API,
				'p': {
					'ID': user['ID'],
					'admin': user['admin'] ? 0 : 1
				}
			})
			.then(function(response) {
				var data = response.data;
				if(!data['user']) {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				user['admin'] = data['user']['admin'];

				note.ok(_('note_adminx', 0, [user['login'], user['admin'] ? 'granted' : 'revoked']));


				// I changed my own access rights - re-init entire UI
				if($rootScope.ME['user']['ID'] === user['ID']) {
					$rootScope.ME['user']['admin'] = user['admin'];
					Auth.saveToken(data);
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _delDb(user) {
			// update DB
			http.post($scope.uriApiCms + 'deleteUser', {'api': $scope.API, 'p': {'ID': user['ID']}})
			.then(function(response) {
				var data = response.data;
				if(data !== true && data !== 'true') {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				note.ok(_('note_xdeleted', 0, _('user', 1) + ' ' + user['login']));
				// remove from UI
				// var tr = document.getElementById('user'+user['ID']);
				// tr.parentNode.removeChild(tr);

				// remove from local data cache
				var removeIndex = vm.USERS.indexOf(user);
				if(removeIndex > -1) {
					vm.USERS.splice(removeIndex, 1);
				}

				// I changed my own password - re-init entire UI
				if($rootScope.ME['user']['login'] === user['login']) {
					Auth.logout(true);
					// $timeout(function() {
					// 	location.reload();
					// },3000);
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
	}

	UserEditModalController.$inject = ['$scope', 'i18n', '$uibModalInstance'];
	function UserEditModalController($scope, _, $uibModalInstance) {
		/* jshint validthis:true */
		var vm = this;
		// $scope.newPasswd = '';
		vm.newPasswd = '';
		$scope.newLogin = $scope.user['login'];

		$scope.title = _('user', 1);
		$scope.titlemode = $scope.ADD ? 'addx' : 'editx';

		$scope.ok = ok;
		$scope.cancel = cancel;
		$scope.generate = generate;


		function generate() {
			vm.newPasswd = _generatePassword(8);
			$scope.editForm.password.$setTouched();
			$scope.editForm.password.$setDirty();
		}
		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}
		function ok() {
			$scope.submitted = true;
			if(!$scope.ADD) {
				if($scope.editForm.password.$invalid) {
					// stop processing, error msgs will be displayed automatically
					return;
				}
				$scope.newPasswd = vm.newPasswd;
			}
			if($scope.ADD && $scope.editForm.login.$invalid) {
				// stop processing, error msgs will be displayed automatically
				return;
			}
			$uibModalInstance.close($scope);
		}


		/////////////////////


		/**
		 * copied from http://stackoverflow.com/a/5840653/818732
		 *
		 * @param  integer len length of password
		 * @return string      random password
		 */
		function _generatePassword(len) {
			var pwd = [];
			var	cc = String.fromCharCode;
			var	r = Math.random;
			var	rnd;
			var	i;
			// push a number
			pwd.push(cc(48 + (0 | r() * 10)));
			// push an upper case letter
			pwd.push(cc(65 + (0 | r() * 26)));

			for(i = 2; i < len; i++) {
				// generate upper OR lower OR number
				rnd = 0 | r() * 62;
				pwd.push(cc(48 + rnd + (rnd > 9 ? 7 : 0) + (rnd > 35 ? 6 : 0)));
			}

			// shuffle letters in password
			return pwd.sort(function() {
				return r() - 0.5;
			}).join('');
		}

	}

	UserAdminModalController.$inject = ['$scope', 'i18n', '$uibModalInstance'];
	function UserAdminModalController($scope, _, $uibModalInstance) {
		$scope.title = _('adminx', 0, [$scope.user['admin'] ? 'revoke' : 'grant']);
		$scope.username = $scope.user['login'];
		$scope.ok = ok;
		$scope.cancel = cancel;



		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}
		function ok() {
			$uibModalInstance.close($scope);
		}

	}
})();
