(function() {
	'use strict';
	angular.module('bt.dashboard')
		.controller('VideoConfigController', VideoConfigController);


	VideoConfigController.$inject = ['http', '$scope', '$rootScope', '$state', '$stateParams', '$uibModal', 'smartUpdate', 'i18n', 'notification', 'Auth', '$sce'];
	function VideoConfigController(http, $scope, $rootScope, $state, $stateParams, $uibModal, smartUpdate, _, note, Auth, $sce) {
		/* jshint validthis:true */
		var vm = this;
		vm.videoId = $stateParams.id ? parseInt($stateParams.id) : null;
		vm.castTypes = {
			'': {
				name: 'String',
				pattern: '',
				placeholder: '*'},
			'bool': {
				name: 'Boolean',
				pattern: /^[0,1]$/,
				placeholder: '0,1'},
			'int': {
				name: 'Integer',
				pattern: /^[0-9]*$/,
				placeholder: '0-9'},
			'float': {
				name: 'Float',
				pattern: /^[-+]?\d*\.?\d+$/,
				placeholder: '0-9.0-9'}
		};

		vm.addGeneral = addGeneral;
		vm.addObj = null;
		vm.addPromise = null; // README used for both add-dialogues
		vm.addVal = '';
		vm.addVideo = addVideo;
		vm.addVideoObj = null;
		vm.addVideoVal = '';
		vm.CONFIGS = [];
		vm.delete = del;
		vm.edit = edit;
		vm.maxLocales = $rootScope.availableLocales.length;
		vm.MYCONFIGS = null;
		vm.MYCONFIGS_ = {};
		vm.MYCONFIGSVIDEO = null;
		vm.MYCONFIGSVIDEO_ = {};
		vm.selectDefault = selectDefault;
		vm.selectDefaultVideo = selectDefaultVideo;
		vm.videoName = null;
		$scope.getGroup = getGroup;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.loadPromise = null;
		$scope.reload = initView;
		$scope.orderByField = 'Param';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function addGeneral() {
			if(!vm.addObj) {
				return true;
			}
			if(!vm.addVal || !vm.addVal.trim()) {
				note.warn('Default value missing');

				return true;
			}

			_addDb({
				'CastType': vm.addObj['CastType'],
				'Param': vm.addObj['Param'],
				'Val': vm.addVal.trim(),
				'Video_ID': null,
			}, _processAddGeneral);
		}
		function addVideo() {
			if(!vm.addVideoObj) {
				return true;
			}
			if(!vm.addVideoVal || !vm.addVideoVal.trim()) {
				note.warn('Default value missing');

				return true;
			}

			_addDb({
				'CastType': vm.addVideoObj['CastType'],
				'Param': vm.addVideoObj['Param'],
				'Val': vm.addVideoVal.trim(),
				'Video_ID': vm.videoId,
			}, _processAddVideo);
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
		function selectDefault() {
			var config = vm.addObj;
			if(config['CastType'] === '' && config['options'].length) {
				vm.addVal = config['defaultOption'];
			} else {
				vm.addVal = '';
			}
		}
		function selectDefaultVideo() {
			var config = vm.addVideoObj;
			if(config['CastType'] === '' && config['options'].length) {
				vm.addVideoVal = config['defaultOption'];
			} else {
				vm.addVideoVal = '';
			}
		}
		var _default = _('default');
		var _other = _('other');
		function getGroup(config, option) {
			return config['defaultOption'] == option ? _default : _other;
		}


		/////////////////////


		function initView() {
			smartUpdate.setFields(['Val']);

			// get video info
			if(vm.videoId) {
				http.post($scope.uriApiVideo + 'getVideo', {'api': $scope.API, 'p': vm.videoId})
				.then(function(response) {
					if(response['data']['Name']) {
						vm.videoName = response['data']['Name'];
					} else {
						vm.videoId = null;
						$state.transitionTo($state.current, {}, {reload: true});
					}
				},
				Auth.checkHttpStatus.bind(Auth));
			}

			// get all available
			$scope.loadPromise = http.post($scope.uriApiCms + 'getConfig', {'api': $rootScope.DEFAULT_API, 'p': {'locale': $rootScope.locale}})
			.then(function(response) {
				var data = response['data'];
				for(var i = data.length - 1; i >= 0; i--) {
					// smartUpdate.makeBackup(data[i]);
					_makeOptions(data[i]);
				}
				vm.CONFIGS = data;

				// wait for the general config, then load account and video configs
				// get account wide settings
				http.post($scope.uriApiVideo + 'getConfigList', {'api': $rootScope.API, 'p': -1})
				.then(function(response) {
					response['video_ID'] = null;
					vm.MYCONFIGS = _processConfigList(response, 'used');
					vm.MYCONFIGS_ = response['data']['Config'] || {};
				},
				Auth.checkHttpStatus.bind(Auth));

				// get video specific settings
				if(vm.videoId !== null) {
					http.post($scope.uriApiVideo + 'getConfigList', {'api': $rootScope.API, 'p': vm.videoId, 'p2': true})
					.then(function(response) {
						response['video_ID'] = vm.videoId;
						vm.MYCONFIGSVIDEO = _processConfigList(response, 'usedVideo');
						vm.MYCONFIGSVIDEO_ = response['data']['Config'] || {};
					},
					Auth.checkHttpStatus.bind(Auth));
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _processConfigList(response, usedParam) {
			var castType = null;
			var data = [];
			var defaultConfig;
			var defaultOption = null;
			var DefaultVal = null;
			var options = null;
			var row;
			var formType;

			var value;
			for(var el in response['data']['Config']) {
				value = response['data']['Config'][el];
				value = value === true ? '1' : (value === false ? '0' : value);
				defaultConfig = vm.CONFIGS.find(_findConfig, el);
				if(defaultConfig) {
					defaultConfig[usedParam] = true;
					castType = defaultConfig['CastType'];
					formType = defaultConfig['formType'];
					options = defaultConfig['options'];
					defaultOption = defaultConfig['defaultOption'];
					DefaultVal = defaultConfig['DefaultVal'];
					// console.log('defaultConfig', defaultConfig);
					if(options.length && options.indexOf(value) === -1) {
						// console.warn('bad value for "' + el + '" detected:', value, 'allowed:', options);
					}
				} else {
					castType = null;
					formType = 'text';
					options = null;
					defaultOption = null;
					DefaultVal = null;
					// console.warn('unknown config detected');
				}
				row = {
					'CastType': castType,
					'defaultOption': defaultOption,
					'DefaultVal': DefaultVal,
					'options': options,
					'Param': el,
					'formType': formType,
					'Val': value,
					'Video_ID': response['video_ID'],
				};

				smartUpdate.makeBackup(row);
				// console.log("row",row);
				data.push(row);
			}

			return data;
		}
		function _findConfig(el) {
			/*eslint angular/controller-as-vm: 0*/
			return el['Param'] === this;
		}
		function _makeOptions(config) {
			if(config['options'] && config['options'].length) {
				return;
			}
			var options = config['DefaultVal'].split('|');
			if(options.length > 1) {
				config['formType'] = 'select';
				config['options'] = options;
				config['defaultOption'] = options[0];

				// create new array to add some html
				options = config['DefaultVal'].split('|');
				options[0] = '<u>' + options[0] + '</u> (' + _('default') + ')';
				config['DefaultValHtml'] = $sce.trustAsHtml(options.join(', '));
			} else {
				config['formType'] = config['CastType'] === 'bool' ? 'radio' : 'text';
				config['options'] = [];
				var DefaultValHtml = config['DefaultVal'] || '';
				if(config['CastType'] === 'bool') {
					DefaultValHtml = DefaultValHtml ? 'true' : 'false';
				}
				config['DefaultValHtml'] = $sce.trustAsHtml(DefaultValHtml);
			}
		}
		function _processDefaults(config, usedField) {
			var defaultConfig = vm.CONFIGS.find(_findConfig, config['Param']);
			if(defaultConfig) {
				// legacy check
				defaultConfig[usedField] = true;
				config['defaultOption'] = defaultConfig['defaultOption'];
				config['options'] = defaultConfig['options'];
				config['DefaultVal'] = defaultConfig['DefaultVal'];
				config['formType'] = defaultConfig['formType'];

			}
		}
		function _processAddGeneral(config) {
			_processDefaults(config, 'used');

			// add to UI
			vm.MYCONFIGS.push(config);
			vm.MYCONFIGS_[config['Param']] = config['Val'];
			// console.info('defaultConfig', defaultConfig);
			// reset form
			vm.addObj = null;
			vm.addVal = '';
		}
		function _processAddVideo(config) {
			_processDefaults(config, 'usedVideo');

			// add to UI
			vm.MYCONFIGSVIDEO.push(config);
			vm.MYCONFIGSVIDEO_[config['Param']] = config['Val'];
			// console.info('defaultConfig', defaultConfig);
			// reset form
			vm.addVideoObj = null;
			vm.addVideoVal = '';
		}
		function _modalDismissed() {
			// console.info('Modal dismissed at: ' + new Date());
		}
		function _addDb(config, callback) {
			// update DB if no double was found
			vm.addPromise = http.post($scope.uriApiVideo + 'saveConfig', {
				'api': $rootScope.API,
				'p': config
			})
			.then(function(response) {
				var data = response['data'];
				if(!data || (data && data['error'] && data['error'].length)) {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				smartUpdate.makeBackup(config);

				// confirmation message
				note.ok(_('note_xadded', 0, config['Param']));
				// console.log("added", config, data);
				callback(config);
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _editDb(config) {
			// update DB
			return http.post($scope.uriApiVideo + 'saveConfig', {
				'api': $rootScope.API,
				'p': {
					'CastType': config['CastType'],
					'Param': config['Param'].trim(),
					'Val': config['Val'].trim(),
					'Video_ID': config['Video_ID'],
				}
			})
			.then(function(response) {
				var data = response['data'];
				if(!data || (data && data['error'] && data['error'].length)) {
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
		function _delDb(config) {
			// update DB
			config.delPromise = http.post($scope.uriApiVideo + 'deleteConfig', {'api': $rootScope.API, 'p': config['Param'], 'p2': config['Video_ID']})
			.then(function(response) {
				var data = response['data'];
				var arr;
				var obj;
				var usedParam;
				if(data !== true && data !== 'true') {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				note.ok(_('note_xdeleted', 0, config['Param']));

				// setup updates
				if(config['Video_ID']) {
					arr = vm.MYCONFIGSVIDEO;
					obj = vm.MYCONFIGSVIDEO_;
					usedParam = 'usedVideo';
				} else {
					arr = vm.MYCONFIGS;
					obj = vm.MYCONFIGS_;
					usedParam = 'used';
				}
				// remove from local data cache / update ui
				var removeIndex = arr.indexOf(config);
				if(removeIndex > -1) {
					arr.splice(removeIndex, 1);
				}
				delete obj[config['Param']];
				// update add-select
				var defaultConfig = vm.CONFIGS.find(_findConfig, config['Param']);
				if(defaultConfig) {
					defaultConfig[usedParam] = false;
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}

	}


})();
