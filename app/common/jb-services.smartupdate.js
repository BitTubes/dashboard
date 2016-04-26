(function() {
	'use strict';
	angular
		.module('jb.services')
		.factory('smartUpdate', smartUpdateFactory);



	function smartUpdateFactory() {
		var fields = null;

		return {
			makeBackup: makeBackup,
			setFields : setFields,
			wasChanged: wasChanged,
			wasChangedNotEmpty: wasChangedNotEmpty,
			_test : {
				get fields() { return fields; }
			}
		};


		///////////////////////////////


		function setFields(arr) {
			fields = arr;
		}
		function makeBackup(obj) {
			if(fields === null) {
				console.error('fields array not set');
				return false;
			}
			for (var i = fields.length - 1; i >= 0; i--) {
				if('undefined' === typeof(obj[fields[i]])) {
					console.error('trying to backup non-existing field');
				} else {
					obj[fields[i] + 'Bak'] = obj[fields[i]];
				}
			}
			return true;
		}
		function wasChanged(obj) {
			for (var i = fields.length - 1; i >= 0; i--) {
				if(obj[fields[i] + 'Bak'] !== obj[fields[i]]) {
					return true;
				}
			}
			return false;
		}
		function wasChangedNotEmpty(obj) {
			for (var i = fields.length - 1; i >= 0; i--) {
				if(obj[fields[i]] && obj[fields[i] + 'Bak'] !== obj[fields[i]]) {
					return true;
				}
			}
			return false;
		}
	}




})();


