(function() {
	"use strict";
	angular
		.module('bt.dashboard')
		.controller('userController', userController)
		.controller('userEditModalCtrl', userEditModalCtrl);


	userController.$inject = ['http','$stateParams','$scope','$rootScope','$timeout', '$uibModal', 'i18n', 'notification', 'Auth', '$state'];
	function userController(http, $stateParams, $scope, $rootScope, $timeout, $uibModal, _, note, Auth, $state) {
		/* jshint validthis:true */
		var vm = this;
		var editMe = ($stateParams.editme==="me");
		vm.add = add;
		vm.delete = del;
		vm.edit = edit;
		vm.USERS = null;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.orderByField = 'ID';
		$scope.reverseSort = true;


		initView();


		/////////////////////


		function add() {
			$scope.ADD = 1;
			$scope.user = {login:''};

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/user/user.edit.html',
				controller: 'userEditModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(add_db, modal_dismissed);
		}
		function del(user) {
			$scope.delObj = user;
			$scope.deleteWarning = user["login"]===$rootScope.ME['user']['login'];
			$scope.Name = user["login"];
			$scope.title = _('user',1);

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/del.html',
				controller: 'deleteModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(del_db, modal_dismissed);
		}
		function edit(user) {
			$scope.ADD = 0;
			$scope.editWarning = user["login"]===$rootScope.ME['user']['login'];
			$scope.user = user;

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/user/user.edit.html',
				controller: 'userEditModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(edit_db, modal_dismissed);
		}


		/////////////////////


		function initView() {
			http.post($scope.uriApiCms+'getUsers', { 'api': $scope.API, 'p':{times:1} })
			.then(function(response){
				var data = response.data;
				vm.USERS = data;

				if(editMe) {
					vm.edit($rootScope.ME['user']);
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function modal_dismissed() {
			if(editMe) {
				// console.log("reroute to default users list");
				$state.transitionTo("users");
			}
			// console.info('Modal dismissed at: ' + new Date());
		}
		function add_db(scope){
			// update DB
			http.post($scope.uriApiCms+'addUser', {
				'api': $scope.API,
				'p':{
					'login': scope.newLogin,
					'pw': scope.newPasswd
				}
			})
			.then(function(response){
				var data = response.data;
				if(!data['ID']) {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				} else {
					vm.USERS.push(data);
				}
				note.ok(_('note_xadded',0,_('user',1)+' '+data['login']));
				// remove from UI
				// var tr = document.getElementById('user'+user['ID']);
				// tr.parentNode.removeChild(tr);
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function edit_db(scope) {
			// console.log('ok', newLogin, newPasswd);
			// console.log('ok2', scope.newLogin, scope.newPasswd);
			var user = scope.user;

			// update DB
			http.post($scope.uriApiCms+'updateUser', {
				'api': $scope.API,
				'p': {
					'ID': user['ID'],
					'login': scope.newLogin,
					'pw': scope.newPasswd
				}
			})
			.then(function(response){
				var data = response.data;
				if(!data['user']) {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				user['login'] = data['user']['login'];

				note.ok(_('note_pwupdated',0,user['login']));


				// I changed my own password - re-init entire UI
				if($rootScope.ME['user']['ID'] === user['ID']) {
					$rootScope.ME['user']['login'] = user['login'];
					Auth.saveToken(data);
					// $timeout(function() {
					// 	location.reload();
					// },3000);
					if(editMe) {
						// console.log("reroute to default users list");
						$state.transitionTo("users");
					}
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function del_db(user) {
			// update DB
			http.post($scope.uriApiCms+'deleteUser', { 'api': $scope.API, 'p':{'ID':user['ID']} })
			.then(function(response){
				var data = response.data;
				if(data !== true && data !== "true") {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				note.ok(_('note_xdeleted',0,_('user',1)+' '+user['login']));
				// remove from UI
				// var tr = document.getElementById('user'+user['ID']);
				// tr.parentNode.removeChild(tr);

				// remove from local data cache
				var removeIndex = vm.USERS.indexOf(user);
				if (removeIndex > -1) {
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

	userEditModalCtrl.$inject = ['$scope','i18n', '$uibModalInstance'];
	function userEditModalCtrl($scope, _, $uibModalInstance) {
		$scope.newPasswd = "";
		$scope.newLogin = $scope.user["login"];

		$scope.title = _('user',1);
		$scope.titlemode = $scope.ADD ? 'addx' : 'editx';

		$scope.ok = ok;
		$scope.cancel = cancel;
		$scope.generate = generate;


		function generate() {
			$scope.newPasswd = Math.random().toString(36).slice(-8);
			$scope.editForm.password.$setTouched();
			$scope.editForm.password.$setDirty();
		}
		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}
		function ok() {
			$scope.submitted = true;
			if($scope.editForm.password.$invalid) {
				// stop processing, error msgs will be displayed automatically
				return;
			}
			if($scope.ADD && $scope.editForm.login.$invalid) {
				// stop processing, error msgs will be displayed automatically
				return;
			}
			$uibModalInstance.close($scope);
		}

	}

})();
