(function() {
	'use strict';
	angular.module('bt.dashboard')
		.controller('SqlController', SqlController);


	SqlController.$inject = ['http', '$scope', 'i18n', 'notification', 'Auth'];
	function SqlController(http, $scope, _, note, Auth) {
		/* jshint validthis:true */
		var vm = this;
		vm.sqlInput = '';
		vm.sqlOutput = '';
		vm.databases = [];
		vm.sqlOutputArr = [];
		vm.sqlOutputRow = 3;
		vm.complete = complete;


		/////////////////////


		function complete() {
			// sanitize input a bit
			vm.sqlInput = vm.sqlInput.trim();
			if(!vm.sqlInput || vm.sqlInput === ';') {
				note.info('No SQL Query given');
				vm.sqlInput = '';

				return;
			}
			if(vm.sqlInput.slice(-1) !== ';') {
				vm.sqlInput += ';';
			}
			vm.sqlOutput = '';

			_completeDb();
		}


		/////////////////////


		function _completeDb() {
			// update DB
			http.post($scope.uriApiCms + 'getDbs', {'api': $scope.API})
			.then(function(response) {
				var data = vm.databases = response.data;
				if(!data || (data && data['error'] && data['error'].length)) {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				_createSQL();
				note.ok('SQL created');
			},
			Auth.checkHttpStatus.bind(Auth));
		}

		function _createSQL() {
			// create queries for each Database
			for(var i = 0; i < vm.databases.length; i++) {
				vm.sqlOutputArr.push('USE ' + vm.databases[i] + '; ' + vm.sqlInput);
			}
			/*eslint quotes: 0*/
			// write to UI
			var separator = "\n";
			if(vm.sqlInput.indexOf("\n") !== -1) {
				separator = "\n--\n";
			}
			vm.sqlOutputRow = vm.sqlOutputArr.length;
			vm.sqlOutput = vm.sqlOutputArr.join(separator);

			// free up memory
			vm.sqlOutputArr.length = 0;
		}
	}

	// sqlWaitController.$inject = ['$scope','i18n'];
	// function sqlWaitController($scope, _) {
	// 	$scope.msg_waiting = _('wait_addingx',null,'video');
	// 	$scope.msg_taketime = _('wait_takex',null,['5',_('minute',5)]);
	// }

})();
