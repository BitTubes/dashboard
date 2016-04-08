(function() {
	"use strict";
	angular.module('bittubes')
		.controller('configDefineController', configDefineController);


	configDefineController.$inject = ['http','$scope', '$rootScope', 'smartUpdate',  '$stateParams', 'i18n', 'notification','AUTH'];
	function configDefineController(http, $scope, $rootScope, smartUpdate, $stateParams, _, note, Auth) {
		/* jshint validthis:true */
		var vm = this;
		var config_ID = parseInt($stateParams.id);
		var availableLocales = {};
		vm.castTypes = {
			'': 	'String',
			'bool': 'Boolean',
			'int': 	'Integer',
			'float':'Float'
		};
		vm.LOCALES = [];
		$scope.CONFIG = null;


		vm.edit = edit;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.orderByField = 'Param';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function edit(definition) {
			if(!definition['txt'] && smartUpdate.wasChanged(definition)) {
				del_db(definition);
				return true;
			}
			if(!smartUpdate.wasChangedNotEmpty(definition)) {
				return true;
			}
			edit_db(definition);
		}


		/////////////////////


		function initView() {
			smartUpdate.setFields(['txt']);
			// get details on the current config
			http.post($scope.uriApiCms+'getConfigId', { 'api': $rootScope.DEFAULT_API, p:{'ID': config_ID} })
			.then(function(response){
				// var data = response.data;
				$scope.CONFIG = response.data;

			},
			Auth.checkHttpStatus.bind(Auth));

			for (var i = $rootScope.availableLocales.length - 1; i >= 0; i--) {
				availableLocales[$rootScope.availableLocales[i].code] = $rootScope.availableLocales[i].name;
			}
			// get definitions
			http.post($scope.uriApiCms+'getConfigDef', { 'api': $rootScope.DEFAULT_API, 'p':{'ID':config_ID} })
			.then(function(response){
				var data = response.data;
				for (var i = data.length - 1; i >= 0; i--) {
					smartUpdate.makeBackup(data[i]);
					data[i]['localeName'] = availableLocales[data[i]['locale']];
					delete availableLocales[data[i]['locale']];
				}
				vm.LOCALES = data;
				// console.log(vm.LOCALES);

				// add missing elements to array
				for(var el in availableLocales) {
					vm.LOCALES.push({
						'locale':el, 
						'localeName':availableLocales[el],
						'txt':"",
						'txtBak':"",
						'ID':config_ID
					});
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function edit_db(definition) {
			// update DB
			return http.post($scope.uriApiCms+'saveConfigDef', { 
				'api': $rootScope.DEFAULT_API, 
				'p':{
					'ID': $scope.CONFIG['ID'],
					'locale': definition['locale'],
					'txt': definition['txt'].trim()
				} 
			})
			.then(function(response){
				var data = response.data;
				if(!data || (data && data['error'] && data['error'].length)) {
					note.error(_('note_dberror'));
					return;
				}
				if(!definition['txtBak']) {
					// confirmation ADD message
					note.ok(_('note_xadded',0,definition['localeName']));
				} else {
					// confirmation EDIT message
					note.ok(_('note_xupdated',0,definition['localeName']));
				}

				// update backups
				smartUpdate.makeBackup(definition);

			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function del_db(definition) {
			// update DB
			http.post($scope.uriApiCms+'deleteConfigDef', { 'api': $rootScope.DEFAULT_API, 'p':{'ID':definition['ID'], 'locale':definition['locale']} })
			.then(function(response){
				var data = response.data;
				if(data !== true && data !== "true") {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				note.info(_('note_xdeleted',0, definition['localeName']));

				// update backups
				smartUpdate.makeBackup(definition);

			},
			Auth.checkHttpStatus.bind(Auth));
		}

	}


})();