(function() {
	'use strict';
	angular
		.module('jb.services')
		.factory('smartUpdate', smartUpdateFactory);


	/**
	 * enables the front-end to limit requests to the backend to situations when something was actually updated
	 * instead of relying solely on "change", "blur" or "click" events
	 *
	 * @return {angularJs}
	 */
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


		/**
		 * supposed to be used initially to create a reference point
		 *
		 * @param  {Object} obj - the dataset which should be backed up in part
		 * @return {boolean}
		 */
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
		/**
		 * set the keys that need to be looked at for knowing what's changed (and need to be backed up initially)
		 *
		 * @param {Array} arr - set of keys
		 */
		function setFields(arr) {
			fields = arr;
		}
		/**
		 * returns true if at least one of the fields has changed since makeBackup was last run
		 *
		 * @param  {Object} obj - the dataset
		 * @return {boolean}
		 */
		function wasChanged(obj) {
			for (var i = fields.length - 1; i >= 0; i--) {
				if(obj[fields[i] + 'Bak'] !== obj[fields[i]]) {
					return true;
				}
			}
			return false;
		}
		/**
		 * returns true if at least one of the fields has changed since makeBackup was last run and is NOT empty now
		 *
		 * @param  {Object} obj - the dataset
		 * @return {boolean}
		 */
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


