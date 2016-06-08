(function() {
	'use strict';
	angular
		.module('jb.services')
		.filter('utcdate', utcdateFilter);


	utcdateFilter.$inject = ['$filter', '$locale'];
	/**
	 * filter that converts a utc date into a local date
	 *
	 * @param  {angularJs} $filter   service
	 * @param  {angularJs} $locale   service
	 * @return {string}
	 */
	function utcdateFilter($filter, $locale) {
		return function(input, format) {
			if(!input) {
				return input;
			}
			if(!angular.isDefined(format)) {
				format = $locale['DATETIME_FORMATS']['medium'];
				// format = 'MMM d, y h:mm:ss a';
			}
			if(input * 1 != input) {
				// assume a string and not a numeric timestamp
				// check for included timestamp
				var test = input.split(' ');
				test = test[test.length - 1];
				if(test.indexOf('+') === -1 && test.indexOf('-') === -1 && test.indexOf('UTC') === -1) {
					// no timestamp found
					input += ' UTC';
				}
			}
			var date = new Date(input);
			// var d = new Date();
			var _utc = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());

			return $filter('date')(_utc, format);
		};
	}



})();


