(function() {
	'use strict';
	angular.module('bt.dashboard')
		.controller('ConfigController', ConfigController);


	ConfigController.$inject = ['http', '$scope', '$rootScope', '$uibModal', 'smartUpdate', 'i18n', 'notification', 'Auth'];
	function ConfigController(http, $scope, $rootScope, $uibModal, smartUpdate, _, note, Auth) {
		/* jshint validthis:true */
		var vm = this;
		vm.castTypes = [
			{val: '', name: 'String'},
			{val: 'bool', name: 'Boolean'},
			{val: 'int', name: 'Integer'},
			{val: 'float', name: 'Float'}
		];
		vm.castTypesPattern = {
			'': {pattern: '',	placeholder: '*'},
			'bool': {pattern: /^[0,1]$/, placeholder: '0,1'},
			'int': {pattern: /^[0-9]*$/, placeholder: '0-9'},
			'float': {pattern: /^[-+]?\d*\.?\d+$/, placeholder: '0-9.0-9'}
		};
		vm.maxLocales = $rootScope.availableLocales.length;
		vm.addPromise = null;
		vm.addParam = null;
		vm.addCastType = '';
		vm.addDefaultVal = '';
		vm.CONFIGS = [];


		vm.add = addDb;
		vm.delete = del;
		vm.edit = edit;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.orderByField = 'Param';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function addDb() {
			if(!vm.addParam || !vm.addParam.trim()) {
				return true;
			}
			if(vm.addCastType !== '' && (!vm.addDefaultVal || !vm.addDefaultVal.trim())) {
				note.warn('Default value missing');

				return true;
			}

			var p = {
				'Param': vm.addParam.trim(),
				'CastType': vm.addCastType,
				'DefaultVal': vm.addDefaultVal.trim()
			};

			// test if we already have a parameter with that value in our UI
			for(var i = vm.CONFIGS.length - 1; i >= 0; i--) {
				if(p['Param'] === vm.CONFIGS[i]['Param']) {
					smartUpdate.makeBackup(p);
					return _editDb(p);
				}
			}

			// update DB if no double was found
			vm.addPromise = http.post($scope.uriApiCms + 'addConfig', {
				'api': $rootScope.DEFAULT_API,
				'p': p
			})
			.then(function(response) {

				var data = response.data;
				if(!data || (data && data['error'] && data['error'].length)) {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				smartUpdate.makeBackup(data);

				// add to UI
				vm.CONFIGS.push(data);

				// confirmation message
				note.ok(_('note_xadded', 0, _('Parameter', 1) + ' ' + vm.addParam));

				// reset form
				vm.addParam = null;
				vm.addCastType = '';
				vm.addDefaultVal = '';

				document.getElementById('addParam').focus();
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function edit(config) {
			// console.log("edit",config);
			if(!smartUpdate.wasChangedNotEmpty(config)) {
				// console.log("unchanged");
				return true;
			}

			_editDb(config);
		}
		function del(config) {
			// $scope.customer = customer;
			$scope.delObj = config;
			$scope.Name = config['Param'];
			$scope.title = 'Config';


			$scope.deleteWarning = false;


			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/del.html',
				controller: 'DeleteModalController',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(_delDb, _modalDismissed);
		}


		/////////////////////


		function initView() {
			smartUpdate.setFields(['Param', 'CastType', 'DefaultVal']);

			http.post($scope.uriApiCms + 'getConfig', {'api': $rootScope.DEFAULT_API})
			.then(function(response) {
				// var data = response.data;
				for(var i = response.data.length - 1; i >= 0; i--) {
					smartUpdate.makeBackup(response.data[i]);
				}
				vm.CONFIGS = response.data;

			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _editDb(config) {
			// update DB
			return http.post($scope.uriApiCms + 'updateConfig', {
				'api': $rootScope.DEFAULT_API,
				'p': {
					'oldParam': config['ParamBak'].trim(),
					'Param': config['Param'].trim(),
					'CastType': config['CastType'],
					'DefaultVal': config['DefaultVal'].trim()
				}
			})
			.then(function(response) {
				var data = response.data;
				if(!data || (data && data['error'] && data['error'].length)) {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				// update backups
				smartUpdate.makeBackup(config);

				// confirmation message
				note.ok(_('note_xupdated', 0, config['Param']));

			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _modalDismissed() {
			// console.info('Modal dismissed at: ' + new Date());
		}
		function _delDb(config) {
			// update DB
			config.delPromise = http.post($scope.uriApiCms + 'deleteConfig', {'api': $rootScope.DEFAULT_API, 'p': {'Param': config['Param']}})
			.then(function(response) {
				var data = response.data;
				if(data !== true && data !== 'true') {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				note.ok(_('note_xdeleted', 0, 'Config ' + config['Param']));

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
