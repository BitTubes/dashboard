(function() {
	"use strict";
	angular.module('bt.dashboard')
		.controller('customerController', customerController)
		// .controller('customerWaitController', customerWaitController)
		.controller('customerEditModalCtrl', customerEditModalCtrl);


	customerController.$inject = ['http','$scope', '$state', '$rootScope', '$uibModal', 'i18n', 'notification','AUTH', 'waiting'];
	function customerController(http, $scope, $state, $rootScope, $uibModal, _, note, Auth, waiting) {
		/* jshint validthis:true */
		var vm = this;
		vm.add = add;
		vm.CUSTOMERS = null;
		vm.delete = del;
		vm.edit = edit;
		vm.viewAccount = viewAccount;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.orderByField = 'name';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function viewAccount(account) {
			$scope.changeAccount(account);
			$state.transitionTo('users');
		}

		function add() {
			$scope.customer = {'name':'','api':''};
			$scope.ADD = 1;
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/admin/customer/customer.edit.html',
				controller: 'customerEditModalCtrl',
				scope: $scope,
				size: null
			});
			// note.debug('db-api fehlt noch, http-anfrage mit RETURN deaktiviert');

			modalInstance.result.then(add_db , modal_dismissed);
		}
		function edit(customer) {
			$scope.customer = customer;
			$scope.ADD = 0;
			$scope.api_before = customer['api'];
			// note.debug("add check if I'm editing myself and display warning if I am");
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/admin/customer/customer.edit.html',
				controller: 'customerEditModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(edit_db, modal_dismissed);
		}
		function del(customer) {
			// $scope.customer = customer;
			$scope.delObj = customer;
			$scope.Name = customer["name"];
			$scope.title = _('customer',1);


			$scope.deleteWarning = false;


			// note.debug("add check if I'm deleteting myself and display warning if I am");
			var templateUrl;
			if(customer["deleted"]) {
				templateUrl = 'common/del.0.html';
			} else {
				templateUrl = 'common/del.html';
			}

			// console.log('delete', user['ID']);
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: templateUrl,
				controller: 'deleteModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(del_db, modal_dismissed);
		}

		/////////////////////


		function initView() {
			http.post($scope.uriApiCms+'getCustomersAll', { 'api': $rootScope.DEFAULT_API,  })
			.then(function(response){
				// var data = response.data;
				vm.CUSTOMERS = response.data;
				// console.log(response.data);
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function modal_dismissed() {
			// console.info('Modal dismissed at: ' + new Date());
		}
		function add_db(scope) {
			var customer = scope.customer;
			// show waiting view
			waiting.show(_('wait_addingx',null,'customer'), _('wait_takex',null,['1','t_minute']));
			// $state.go('customers.wait');

			// update DB
			http.post($scope.uriApiCms+'addCustomer', {
				'api': $rootScope.DEFAULT_API,
				'p':{
					'name': customer["name"],
					'newapi': customer["api"]
				}
			})
			.then(function(response){
				waiting.hide();

				var data = response.data;
				if(!data || (data && data['error'] && data['error'].length)) {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				scope.customer = data['customer'];
				vm.CUSTOMERS.push(scope.customer);
				$rootScope.ME['customers'].push(scope.customer);
				note.ok(_('note_xadded',0,_('customer',1)+' '+scope.customer["name"]));

				viewAccount(scope.customer);
				// vm.getCustomers();
				// remove from UI
				// var tr = document.getElementById('customer'+customer['ID']);
				// tr.parentNode.removeChild(tr);
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function edit_db(scope) {
			// update DB
			var customer = scope.customer;
			http.post($scope.uriApiCms+'updateCustomer', {
				'api': $rootScope.DEFAULT_API,
				'p':{
					'name':customer['name'],
					'api':customer['api'],
					'oldapi':$scope.api_before
				}
			})
			.then(function(response){
				var data = response.data;
				if(data !== true) {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				note.ok(_('note_xupdated',0,customer['name']));

				// update the customer list in the navbar
				if(!customer['deleted']) {
					for (var temp, i = $rootScope.ME['customers'].length - 1; i >= 0; i--) {
						temp = $rootScope.ME['customers'][i];
						if(temp['api'] === $scope.api_before) {
							temp['api'] = customer['api'];
							temp['name'] = customer['name'];
							break;
						}
					}

				}
				// update CURRENT customer variables and storage for next load
				if($rootScope.ACCOUNT['api'] === $scope.api_before) {
					store.set('account', customer);
					$rootScope.ACCOUNT = customer;
					$rootScope.API = customer['api'];
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function del_db(customer) {
			// update DB
			customer.delPromise = http.post($scope.uriApiCms+'toggleCustomer', { 'api': $rootScope.DEFAULT_API, 'p':{'api':customer["api"], 'deleted':customer["deleted"]?'0':'1'} })
			.then(function(response){
				var data = response.data;
				if(data !== true && data !== "true") {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				customer["deleted"] = !customer["deleted"];

				// note.ok(_((customer["deleted"]?'note_xdeleted':'note_xreactivated'),0,_('customer',1)+' '+customer['name']));

				// remove from UI
				// var tr = document.getElementById('user'+user['ID']);
				// tr.parentNode.removeChild(tr);
				for (var customer_index, i = $rootScope.ME['customers'].length - 1; i >= 0; i--) {
					if($rootScope.ME['customers'][i]['api'] === customer['api']) {
						// removeIndex = i;
						customer_index = i;
						break;
					}
				}
				if(customer["deleted"]) {
					note.warn(_('note_xdeleted',0,_('customer',1)+' '+customer['name']));
					// remove from local data cache
					$rootScope.ME['customers'][customer_index]['deleted'] = true;
					if(customer['api'] === $rootScope.API) {
						$rootScope.changeAccount($rootScope.ME['customers'][0]); // switch to default
					}
					// var removeIndex = $rootScope.ME['customers'].indexOf(customer);
					// if (removeIndex > -1) {
					// 	$rootScope.ME['customers'].splice(removeIndex, 1);
					// }
				} else {
					note.ok(_('note_xreactivated',0,_('customer',1)+' '+customer['name']));
					// remove from local data cache
					// $rootScope.ME['customers'].push(customer);
					$rootScope.ME['customers'][customer_index]['deleted'] = false;
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}

	}

	// customerWaitController.$inject = ['$scope','i18n'];
	// function customerWaitController($scope, _) {
	// 	$scope.msg_waiting = _('wait_addingx',null,'customer');
	// 	$scope.msg_taketime = _('wait_takex',null,['1','minute']);
	// }

	customerEditModalCtrl.$inject = ['$scope','i18n', '$uibModalInstance'];
	function customerEditModalCtrl($scope, _, $uibModalInstance) {
		$scope.newPasswd = "";

		$scope.title = _('customer',1);
		$scope.titlemode = $scope.ADD ? 'addx' : 'editx';

		$scope.nameMin = 5;
		$scope.nameMax = 100;
		$scope.apiMin = 2;
		$scope.apiMax = 15;

		$scope.ok = ok;
		$scope.cancel = cancel;


		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}
		function ok() {
			$scope.submitted = true;
			if($scope.editForm.name.$invalid) {
				// stop processing, error msgs will be displayed automatically
				return;
			}
			if($scope.editForm.api.$invalid) {
				// stop processing, error msgs will be displayed automatically
				return;
			}
			$uibModalInstance.close($scope);
		}
	}


})();
