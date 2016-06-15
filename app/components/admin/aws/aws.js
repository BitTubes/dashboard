(function() {
	'use strict';
	angular.module('bt.dashboard')
		.controller('AwsController', AwsController);


	AwsController.$inject = ['http', '$scope', '$state', '$rootScope', '$uibModal', 'i18n', 'notification', 'Auth', 'waiting'];
	function AwsController(http, $scope, $state, $rootScope, $uibModal, _, note, Auth, waiting) {
		/* jshint validthis:true */
		var vm = this;
		vm.add = add;
		vm.CONFIGS = $scope.CONFIGS = null;
		vm.delete = del;
		vm.edit = edit;
		vm.viewAccount = viewAccount;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.loadPromise = null;
		$scope.reload = initView;
		$scope.orderByField = 'name';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function viewAccount(account) {
			$scope.changeAccount(account);
			$state.transitionTo('users');
		}

		function add() {
			$scope.config = {'customer_ID': ''};
			$scope.ADD = 1;
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/admin/aws/aws.edit.html',
				controller: 'AwsEditModalController',
				controllerAs: 'awsEditModalCtrl',
				scope: $scope,
				size: null
			});
			// note.debug('db-api fehlt noch, http-anfrage mit RETURN deaktiviert');

			modalInstance.result.then(_addDb, _modalDismissed);
		}
		function edit(config) {
			$scope.config = config;
			$scope.ADD = 0;
			$scope.apiBefore = config['customer_ID'];
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/admin/aws/aws.edit.html',
				controller: 'AwsEditModalController',
				controllerAs: 'awsEditModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(_editDb, _modalDismissed);
		}
		function del(config) {
			$scope.delObj = config;
			$scope.Name = config['name'];
			$scope.title = _('AWS Config', 1);


			$scope.deleteWarning = false;


			// note.debug("add check if I'm deleteting myself and display warning if I am");
			var templateUrl;
			if(config['deleted']) {
				templateUrl = 'common/del.0.html';
			} else {
				templateUrl = 'common/del.html';
			}

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: templateUrl,
				controller: 'DeleteModalController',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(_delDb, _modalDismissed);
		}

		/////////////////////


		function initView() {
			$scope.loadPromise = http.post($scope.uriApiCms + 'getAwsConfigList', { 'api': $rootScope.DEFAULT_API })
			.then(function(response) {
				_nullNameToDefault(response.data[0]);
				vm.CONFIGS = $scope.CONFIGS = response.data;
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _modalDismissed() {
			// console.info('Modal dismissed at: ' + new Date());
		}
		function _nullNameToDefault(obj) {
			if(obj.name === null) {
				obj.name = '* ' + (_('default').toUpperCase()) + ' *';
			}
		}
		function _addDb(scope) {
			// update DB
			var config = scope.config;

			http.post($scope.uriApiCms + 'addAwsConfig', {
				'api': $scope.API,
				'p': {
					'ID': config.customer_ID,
					's3_bucket': config.s3_bucket,
					'prefix': config.prefix,
					'cloudfront': config.cloudfront,
					'aws_key': config.aws_key,
					'aws_secret': config.aws_secret,
					'aws_region': config.aws_region,
				}
			})
			.then(function(response) {
				var data = response.data;
				if(!data['s3_bucket']) {
					note.error(_('note_dberror'));

					return;
				} else {
					_nullNameToDefault(data);
					config.name = data.name;
					vm.CONFIGS.push(data);
				}
				note.ok(_('note_xadded', 0, 'AWS Config "' + config['name'] + '"'));
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _editDb(scope) {
			// update DB
			var config = scope.config;
			http.post($scope.uriApiCms + 'updateAwsConfig', {
				'api': $rootScope.DEFAULT_API,
				'p': {
					'ID': config.customer_ID,
					's3_bucket': config.s3_bucket,
					'prefix': config.prefix,
					'cloudfront': config.cloudfront,
					'aws_key': config.aws_key,
					'aws_secret': config.aws_secret,
					'aws_region': config.aws_region,
					'oldID': $scope.apiBefore
				}
			})
			.then(function(response) {
				var data = response.data;
				if(!data['s3_bucket']) {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				_nullNameToDefault(data);
				config.name = data.name;
				note.ok(_('note_xupdated', 0, 'AWS Config "' + config['name'] + '"'));
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _delDb(config) {
			// update DB
			config.delPromise = http.post($scope.uriApiCms + 'deleteAwsConfig', {'api': $scope.API, 'p': {'ID': config['customer_ID']}})
			.then(function(response) {
				var data = response.data;
				if(data !== true && data !== 'true') {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				note.ok(_('note_xdeleted', 0, 'AWS Config "' + config['name'] + '"'));

				// remove from local data cache
				var removeIndex = vm.CONFIGS.indexOf(config);
				if(removeIndex > -1) {
					vm.CONFIGS.splice(removeIndex, 1);
				}

			},
			Auth.checkHttpStatus.bind(Auth));
		}

	}

})();
