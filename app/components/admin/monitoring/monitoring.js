(function() {
	'use strict';
	angular.module('bt.dashboard')
		.controller('MonitoringController', MonitoringController);


	MonitoringController.$inject = ['http', '$scope', '$state', '$rootScope', '$uibModal', 'i18n', 'notification', 'Auth', 'waiting', 'store'];
	function MonitoringController(http, $scope, $state, $rootScope, $uibModal, _, note, Auth, waiting, store) {
		/* jshint validthis:true */
		var vm = this;
		// vm.add = add;
		vm.days = 1;
		vm.PINGS = null;
		vm.myChartObject = {};
		// vm.delete = del;
		// vm.edit = edit;
		// vm.viewAccount = viewAccount;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.loadPromise = null;
		$scope.reload = initView;
		$scope.orderByField = 'name';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		// function viewAccount(account) {
		// 	$scope.changeAccount(account);
		// 	$state.transitionTo('users');
		// }

		// function add() {
		// 	$scope.customer = {'name': '', 'api': ''};
		// 	$scope.ADD = 1;
		// 	var modalInstance = $uibModal.open({
		// 		animation: true,
		// 		templateUrl: 'components/admin/customer/customer.edit.html',
		// 		controller: 'CustomerEditModalController',
		// 		scope: $scope,
		// 		size: null
		// 	});
		// 	// note.debug('db-api fehlt noch, http-anfrage mit RETURN deaktiviert');

		// 	modalInstance.result.then(_addDb, _modalDismissed);
		// }
		// function edit(customer) {
		// 	$scope.customer = customer;
		// 	$scope.ADD = 0;
		// 	$scope.apiBefore = customer['api'];
		// 	var modalInstance = $uibModal.open({
		// 		animation: true,
		// 		templateUrl: 'components/admin/customer/customer.edit.html',
		// 		controller: 'CustomerEditModalController',
		// 		scope: $scope,
		// 		size: null
		// 	});

		// 	modalInstance.result.then(_editDb, _modalDismissed);
		// }
		// function del(customer) {
		// 	$scope.delObj = customer;
		// 	$scope.Name = customer['name'];
		// 	$scope.title = _('customer', 1);


		// 	$scope.deleteWarning = false;


		// 	// note.debug("add check if I'm deleteting myself and display warning if I am");
		// 	var templateUrl;
		// 	if(customer['deleted']) {
		// 		templateUrl = 'common/del.0.html';
		// 	} else {
		// 		templateUrl = 'common/del.html';
		// 	}

		// 	var modalInstance = $uibModal.open({
		// 		animation: true,
		// 		templateUrl: templateUrl,
		// 		controller: 'DeleteModalController',
		// 		scope: $scope,
		// 		size: null
		// 	});

		// 	modalInstance.result.then(_delDb, _modalDismissed);
		// }

		/////////////////////


		function initView() {
			$scope.loadPromise = http.post($rootScope.uriApiAnalyzer + 'getMonitoring', { 'api': $rootScope.API, 'p': {'days': vm.days} })
			.then(function(response) {
				vm.PINGS = response.data;
				vm.myChartObject.type = 'LineChart';
				vm.myChartObject.data = {
					'cols': [
						{id: 'gsDateTime', label: 'Time of Day', type: 'date'},
						{id: 'gsMaxResp', label: 'Max. Response Time', type: 'number'},
						{id: 'gsMaxResp', label: 'Avg. Response Time', type: 'number'},
						{id: 'gsMaxResp', label: 'Min. Response Time', type: 'number'},
						{id: 'gsVal', label: 'Error Rate', type: 'number'}
					],
					'rows': []
				};

				angular.forEach(vm.PINGS, function(value) {
					vm.myChartObject.data.rows.push(
						{c: [
							{v: new Date(value['ts']*1000)},
							{v: value['response']['max']},
							{v: value['response']['avg']},
							{v: value['response']['min']},
							{v: value['error_rate']}
						]}
					);
				});

				vm.myChartObject.options = {
					pointSize: 5,
					title: 'HTTP-CDN Monitoring last ' + vm.days + ' days',
					focusTarget: 'category',
					colors: [
						'#ff9900', //orange
						'#3366cc', // blue
						'#109618', // green
						'#dc3912' // red
					],
					legend: { position: 'top' },
					vAxes: {
						0: {title: 'Response Time (ms)', minValue: 0, format: '#,### ms' },
						1: {title: 'Error Rate (errors/call)', minValue: 0, maxValue: 0.05, format: '#,###.## %'}
					},
					series: {
						0: { targetAxisIndex: 0 },
						1: { targetAxisIndex: 0 },
						2: { targetAxisIndex: 0 },
						3: { targetAxisIndex: 1 }
					},
					formatters: formatters

				};

				var formatters = {
					date: [{
						columnNum: 0,
						pattern: 'HH:mm:ss dd:MM:yy'
						// pattern: '#,###.### ms'
					}]
				}

				// var _formatter = new window.google.visualization.NumberFormat({
				// 		pattern:'#,###.### ms'
				// 	}),
				// 	_formatter2 = new window.google.visualization.NumberFormat({
				// 			pattern:'#,###.## %'
				// 	});
				// _formatter.format(myChartObject, 1);

			},
			Auth.checkHttpStatus.bind(Auth));
		}
		// function _modalDismissed() {
		// 	// console.info('Modal dismissed at: ' + new Date());
		// }
		// function _addDb(scope) {
		// 	var customer = scope.customer;
		// 	// show waiting view
		// 	waiting.show(_('wait_addingx', null, 'customer'), _('wait_takex', null, ['1', 't_minute']));

		// 	// update DB
		// 	http.post($scope.uriApiCms + 'addCustomer', {
		// 		'api': $rootScope.DEFAULT_API,
		// 		'p': {
		// 			'name': customer['name'],
		// 			'newapi': customer['api']
		// 		}
		// 	})
		// 	.then(function(response) {
		// 		waiting.hide();

		// 		var data = response.data;
		// 		if(!data || (data && data['error'] && data['error'].length)) {
		// 			// alert("error updating database");
		// 			note.error(_('note_dberror'));

		// 			return;
		// 		}
		// 		scope.customer = data['customer'];
		// 		vm.CUSTOMERS.push(scope.customer);
		// 		$rootScope.ME['customers'].push(scope.customer);
		// 		note.ok(_('note_xadded', 0, _('customer', 1) + ' ' + scope.customer['name']));

		// 		viewAccount(scope.customer);
		// 	},
		// 	Auth.checkHttpStatus.bind(Auth));
		// }
		// function _editDb(scope) {
		// 	// update DB
		// 	var customer = scope.customer;
		// 	http.post($scope.uriApiCms + 'updateCustomer', {
		// 		'api': $rootScope.DEFAULT_API,
		// 		'p': {
		// 			'name': customer['name'],
		// 			'api': customer['api'],
		// 			'oldapi': $scope.apiBefore
		// 		}
		// 	})
		// 	.then(function(response) {
		// 		var data = response.data;
		// 		if(data !== true) {
		// 			// alert("error updating database");
		// 			note.error(_('note_dberror'));

		// 			return;
		// 		}
		// 		note.ok(_('note_xupdated', 0, customer['name']));

		// 		// update the customer list in the navbar
		// 		if(!customer['deleted']) {
		// 			for(var temp, i = $rootScope.ME['customers'].length - 1; i >= 0; i--) {
		// 				temp = $rootScope.ME['customers'][i];
		// 				if(temp['api'] === $scope.apiBefore) {
		// 					temp['api'] = customer['api'];
		// 					temp['name'] = customer['name'];
		// 					break;
		// 				}
		// 			}

		// 		}
		// 		// update CURRENT customer variables and storage for next load
		// 		if($rootScope.ACCOUNT['api'] === $scope.apiBefore) {
		// 			store.set('account', customer);
		// 			$rootScope.ACCOUNT = customer;
		// 			$rootScope.API = customer['api'];
		// 		}
		// 	},
		// 	Auth.checkHttpStatus.bind(Auth));
		// }
		// function _delDb(customer) {
		// 	// update DB
		// 	customer.delPromise = http.post($scope.uriApiCms + 'toggleCustomer', {'api': $rootScope.DEFAULT_API, 'p': {'api': customer['api'], 'deleted': customer['deleted'] ? '0' : '1'}})
		// 	.then(function(response) {
		// 		var data = response.data;
		// 		if(data !== true && data !== 'true') {
		// 			// alert("error updating database");
		// 			note.error(_('note_dberror'));

		// 			return;
		// 		}
		// 		customer['deleted'] = !customer['deleted'];

		// 		for(var customerIndex, i = $rootScope.ME['customers'].length - 1; i >= 0; i--) {
		// 			if($rootScope.ME['customers'][i]['api'] === customer['api']) {
		// 				// removeIndex = i;
		// 				customerIndex = i;
		// 				break;
		// 			}
		// 		}
		// 		if(customer['deleted']) {
		// 			note.warn(_('note_xdeleted', 0, _('customer', 1) + ' ' + customer['name']));
		// 			// remove from local data cache
		// 			$rootScope.ME['customers'][customerIndex]['deleted'] = true;
		// 			if(customer['api'] === $rootScope.API) {
		// 				// switch to default
		// 				$rootScope.changeAccount($rootScope.ME['customers'][0]);
		// 			}
		// 		} else {
		// 			note.ok(_('note_xreactivated', 0, _('customer', 1) + ' ' + customer['name']));
		// 			// remove from local data cache
		// 			$rootScope.ME['customers'][customerIndex]['deleted'] = false;
		// 		}
		// 	},
		// 	Auth.checkHttpStatus.bind(Auth));
		// }

	}


})();
