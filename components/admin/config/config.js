(function() {
	"use strict";
	angular.module('bittubes')
		.controller('configController', configController);


	configController.$inject = ['http','$scope', '$rootScope', '$uibModal', 'i18n', 'notification','AUTH'];
	function configController(http, $scope, $rootScope, $uibModal, _, note, Auth) {
		/* jshint validthis:true */
		var vm = this;
		vm.castTypes = [
			{ val:'', 		name:'String'},
			{ val:'bool', 	name:'Boolean'},
			{ val:'int', 	name:'Integer'},
			{ val:'float', 	name:'Float'}
		];
		vm.castTypesPattern = {
			'': { pattern:'',	placeholder:'*'},
			'bool': { pattern:/^[0,1]$/, placeholder:'0,1'},
			'int': { pattern:/^[0-9]*$/, placeholder:'0-9'},
			'float': { pattern:/^[-+]?\d*\.?\d+$/, placeholder:'0-9.0-9'}
		};
		vm.maxLocales = $rootScope.availableLocales.length;
		vm.addPromise = null;
		vm.addParam = null;
		vm.addCastType = '';
		vm.addDefaultVal = '';


		vm.add = add_db;
		vm.CONFIGS = [];
		vm.delete = del;
		vm.edit = edit;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.orderByField = 'Param';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function add_db() {
			if(!vm.addParam || !vm.addParam.trim()) {
				return true;
			}
			if(vm.addCastType!=='' && (!vm.addDefaultVal || !vm.addDefaultVal.trim())) {
				note.warn('Default value missing');
				return true;
			}

			var p = {
				'Param': vm.addParam.trim(),
				'CastType': vm.addCastType,
				'DefaultVal': vm.addDefaultVal.trim()
			};

			// test if we already have a parameter with that value in our UI
			for (var i = vm.CONFIGS.length - 1; i >= 0; i--) {
				if(p['Param']===vm.CONFIGS[i]['Param']) {
					makeBackup(p);
					return edit_db(p);
				}
			}

			// update DB if no double was found
			vm.addPromise = http.post($scope.uriApiCms+'addConfig', {
				'api': $rootScope.DEFAULT_API, 
				'p': p 
			})
			.then(function(response){

				var data = response.data;
				if(!data || (data && data['error'] && data['error'].length)) {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				makeBackup(data);

				// add to UI
				vm.CONFIGS.push(data);

				// confirmation message
				note.ok(_('note_xadded',0,_('Parameter',1) + ' '+ vm.addParam));

				// reset form
				vm.addParam = null;
				vm.addCastType = '';
				vm.addDefaultVal = '';
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function edit(config) {
			// console.log("edit",config);
			if(!wasChangedNotEmpty(config)) {
				// console.log("unchanged");
				return true;
			}

			edit_db(config);
		}
		function del(config) {
			// $scope.customer = customer;
			$scope.delObj = config;
			$scope.Name = config["Param"];
			$scope.title = 'Config';


			$scope.deleteWarning = false;


			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/del.html',
				controller: 'deleteModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(del_db, modal_dismissed);
		}


		/////////////////////


		function initView() {
			http.post($scope.uriApiCms+'getConfig', { 'api': $rootScope.DEFAULT_API,  })
			.then(function(response){
				// var data = response.data;
				for (var i = response.data.length - 1; i >= 0; i--) {
					makeBackup(response.data[i]);
				}
				vm.CONFIGS = response.data;

			},
			Auth.checkHttpStatus.bind(Auth));
		}
		var fields = ['Param','CastType','DefaultVal'];
		function makeBackup(config) {
			for (var i = fields.length - 1; i >= 0; i--) {
				config[fields[i]+'Bak'] = config[fields[i]];
			}
		}
		function edit_db(config) {
			// update DB
			return http.post($scope.uriApiCms+'updateConfig', { 
				'api': $rootScope.DEFAULT_API, 
				'p':{
					'oldParam': config['ParamBak'].trim(),
					'Param': config['Param'].trim(),
					'CastType': config['CastType'],
					'DefaultVal': config['DefaultVal'].trim()
				} 
			})
			.then(function(response){
				var data = response.data;
				if(!data || (data && data['error'] && data['error'].length)) {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				// update backups
				makeBackup(config);

				// confirmation message
				note.ok(_('note_xupdated',0,config['Param']));

			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function wasChangedNotEmpty(config) {
			for (var i = fields.length - 1; i >= 0; i--) {
				if(config[fields[i]] && config[fields[i]+'Bak'] != config[fields[i]]) {
					return true;
				}
			}
			return false;
		}
		function modal_dismissed() {
			if(editMe) {
				// console.log("reroute to default users list");
				$state.transitionTo("users");
			}
			// console.info('Modal dismissed at: ' + new Date());
		}
		function del_db(config) {
			// update DB
			config.delPromise = http.post($scope.uriApiCms+'deleteConfig', { 'api': $rootScope.DEFAULT_API, 'p':{'Param':config['Param']} })
			.then(function(response){
				var data = response.data;
				if(data !== true && data !== "true") {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				note.ok(_('note_xdeleted',0,'Config'+' '+config['Param']));

				// remove from local data cache
				var removeIndex = vm.CONFIGS.indexOf(config);
				if (removeIndex > -1) {
					vm.CONFIGS.splice(removeIndex, 1);
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}

	}


})();