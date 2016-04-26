(function() {
	'use strict';
	angular
		.module('jb.services')
		.factory('elapsed', elapsedFactory)
		.filter('elapsed', elapsedFilter);



	elapsedFactory.$inject = ['i18n'];
	function elapsedFactory(_) {
		return function(date,neverReplacement) {
			// display a default message if date equals to false
			if (!date) {
				return neverReplacement !== undefined ? neverReplacement : _('never');
			}
			var time;
			var timeNow = new Date().getTime();
			var difference;
			var upcoming;
			var temp;
			var intervals = [
					['t_year', 12],
					['t_month', 4.35], // README month-length in weeks based on 365 days per year
					['t_week', 7],
					['t_day', 24],
					['t_hour', 60],
					['t_minute', 60],
					['t_second', 1000]
				];
			if(date * 1 == date) {
				// assume unix-time
				time = new Date(date);
			} else {
				// sql assumed
				// adapt MySQL timestamp to ISO 8601 format
				if(date.indexOf(' ') !== -1) {
					date = (date.split(' ').join('T'));
				}
				// set timezone to UTC according to ISO 8601 if none was provided
				if(date.indexOf('+') === -1 && (date.split('T')[1]).indexOf('-') === -1) {
					date += '+00:00';
				}
				// the provided date **MUST** be UTC
				time = Date.parse(date);
			}
			difference = timeNow - time;
			upcoming = (difference < 0);

			if(upcoming) {
				difference *= -1;
			}
			for (var i = intervals.length - 1; i >= 0; i--) {
				difference = Math.floor(difference / intervals[i][1]);
				// check if next iteration is still valid
				if(i - 1 >= 0) {
					temp = difference / intervals[i - 1][1];
					if(temp >= 1) {
						continue;
					}
				}
				if(!upcoming) {
					if(i === intervals.length - 1) {
						// if we are about to print seconds, return this instead
						return _('justnow');
					}
					if(difference >= 1) {
						// time is in the past
						return _('xago',null,[difference, _(intervals[i][0], difference)]);
					}
				}
				else {
					// time is in the future
					return _('inx',null,[difference, _(intervals[i][0], difference)]);
				}
			}
		};
	}
	elapsedFilter.$inject = ['elapsed'];
	function elapsedFilter(elapsed) {
		return function(date, neverReplacement) {
			return elapsed(date, neverReplacement);
		};
	}


})();


