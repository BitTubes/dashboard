(function() {
	"use strict";
	angular
		.module('jb.services')
		.factory('elapsed', elapsedFactory)
		.filter('elapsed', elapsedFilter);



	elapsedFactory.$inject = ['i18n'];
	function elapsedFactory(_){
		return function(date,neverReplacement){
			if (!date) { // display a default message if date equals to false
				return neverReplacement!==undefined ? neverReplacement : _('never');
			}
			var time;
			if(date * 1 == date) { // assume unix-time
				time = new Date(date);
			} else {
				time = Date.parse(date);
			}
			var timeNow = new Date().getTime(),
				difference = timeNow - time,
				upcoming = (difference < 0),
				temp,
				intervals = [
					['t_year', 12],
					['t_month', 4.35],  // based on 365 days per year
					['t_week', 7],
					['t_day', 24],
					['t_hour', 60],
					['t_minute', 60],
					['t_second', 1000]
				];
			if(upcoming) {
				difference *= -1;
			}
			for (var i = intervals.length - 1; i >= 0; i--) {
				difference = Math.floor(difference / intervals[i][1]);
				if(i-1 >= 0) { // check if next iteration is still valid
					temp = difference / intervals[i-1][1];
					if(temp>=1) {
						continue;
					}
				}
				if(!upcoming) {
					if(i===intervals.length-1) { // if we are about to print seconds, return this instead
						return _('justnow');
					}
					if(difference >=1) {
						return _('xago',null,[difference, _(intervals[i][0], difference)]);
					}
				}
				else {
					return _('inx',null,[difference, _(intervals[i][0], difference)]);
				}
			}
		};
	}
	elapsedFilter.$inject = ['elapsed'];
	function elapsedFilter(elapsed){
		return function(date, neverReplacement) {
			return elapsed(date, neverReplacement);
		};
	}


})();


