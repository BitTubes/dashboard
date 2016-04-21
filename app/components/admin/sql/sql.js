(function() {
	"use strict";
	angular.module('bt.dashboard')
		.controller('sqlController', sqlController);


	sqlController.$inject = ['http','$scope', 'i18n', 'notification', 'Auth'];
	function sqlController(http, $scope, _, note, Auth) {
		/* jshint validthis:true */
		var vm = this;
		vm.sql_input = "";
		vm.sql_output = "";
		vm.databases = [];
		vm.sql_output_arr = [];
		vm.sql_output_row = 3;
		vm.complete = complete;

		console.log("test");

		/////////////////////


		function complete() {
			// sanitize input a bit
			vm.sql_input = vm.sql_input.trim();
			if(!vm.sql_input || vm.sql_input === ';') {
				note.info('No SQL Query given');
				vm.sql_input = "";
				return;
			}
			if(vm.sql_input.slice(-1) !== ';') {
				vm.sql_input += ';';
			}
			vm.sql_output = "";

			 _complete_db();
		}

		function _complete_db() {
			// update DB
			http.post($scope.uriApiCms+'getDbs', { 'api': $scope.API })
			.then(function(response){

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
			// reset sql array in case we've used it before
			// vm.sql_output_arr.length = 0;

			// create queries for each Database
			for (var i = 0; i < vm.databases.length; i++) {
				vm.sql_output_arr.push("USE " + vm.databases[i] + "; " + vm.sql_input);
			}
			// write to UI
			var separator = "\n";
			if(vm.sql_input.indexOf("\n") !==-1) {
				separator = "\n--\n";
			}
			vm.sql_output_row = vm.sql_output_arr.length;
			vm.sql_output = vm.sql_output_arr.join(separator);

			// free up memory
			vm.sql_output_arr.length = 0;
		}
	}

	// sqlWaitController.$inject = ['$scope','i18n'];
	// function sqlWaitController($scope, _) {
	// 	$scope.msg_waiting = _('wait_addingx',null,'video');
	// 	$scope.msg_taketime = _('wait_takex',null,['5',_('minute',5)]);
	// }

})();
