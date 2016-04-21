(function() {
	"use strict";
	angular
		.module('jb.services')
		.factory('smartUpdate', smartUpdateFactory);



	function smartUpdateFactory() {
		var fields = null;

		return {
			"makeBackup": makeBackup,
			"setFields" : setFields,
			"wasChanged": wasChanged,
			"wasChangedNotEmpty": wasChangedNotEmpty,
		};


		///////////////////////////////


		function setFields(arr) {
			fields = arr;
		}
		function makeBackup(obj) {
			if(fields === null) {
				console.error("fields array not set");
				return;
			}
			for (var i = fields.length - 1; i >= 0; i--) {
				obj[fields[i]+'Bak'] = obj[fields[i]];
			}
		}
		function wasChanged(obj) {
			for (var i = fields.length - 1; i >= 0; i--) {
				if(obj[fields[i]+'Bak'] !== obj[fields[i]]) {
					return true;
				}
			}
			return false;
		}
		function wasChangedNotEmpty(obj) {
			for (var i = fields.length - 1; i >= 0; i--) {
				if(obj[fields[i]] && obj[fields[i]+'Bak'] !== obj[fields[i]]) {
					return true;
				}
			}
			return false;
		}
	}




})();


