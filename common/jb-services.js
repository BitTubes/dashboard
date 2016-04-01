(function() {
	"use strict";
	angular
		.module('jb.services', ['ngAnimate', 'angular-storage', 'jb.i18n'])
		.factory('http', httpFactory)
		.factory('waiting', waitingFactory)
		.factory('elapsed', elapsedFactory)
		.factory('smartUpdate', smartUpdateFactory)
		.filter('elapsed', elapsedFilter)
		.filter('seconds2time', seconds2timeFilter);



	httpFactory.$inject = ['$http','$httpParamSerializerJQLike','store'];
	function httpFactory($http, $httpParamSerializerJQLike, store){
		return {
			get : function(url, params) {
				return $http.get(
					url,
					{
						params: params,
						// paramSerializer: '$httpParamSerializerJQLike',
						// withCredentials:true
						// timeout: 5000,
						headers: {
							'Authorization': 'Bearer ' + store.get('token')
						}
					}
				);
			},
			post : function(url, params) {
				return $http.post(
					url,
					$httpParamSerializerJQLike(params), 
					{
						// params: params,
						// paramSerializer: '$httpParamSerializerJQLike',
						// withCredentials:true
						// timeout: 5000,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization': 'Bearer ' + store.get('token')
						}
					}
				);
			}
		};
	}

	waitingFactory.$inject = ['$uibModal', '$rootScope'];
	function waitingFactory($uibModal, $rootScope){
		/* jshint validthis:true */
		// var vm = this;
		var modalInstance = null;
		var scope = $rootScope.$new();
		scope.msg_waiting = null;
		scope.msg_taketime = null;


		return {
			show : show,
			hide : hide
		};


		function show(msg_waiting, msg_taketime) {
			scope.msg_waiting = msg_waiting;
			scope.msg_taketime = msg_taketime;
			
			modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/waiting.html',
				backdrop: 'static', // disables modal from being closed by clicking on the background
				scope: scope,
				size: 'lg'
			});
		}
		function hide() {
			modalInstance.close();
		}
	}

	function smartUpdateFactory() {
		var fields = null;

		return {
			"setFields" : setFields,
			"makeBackup": makeBackup,
			"wasChanged": wasChanged,
			"wasChangedNotEmpty": wasChangedNotEmpty,
		};

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
				if(obj[fields[i]+'Bak'] != obj[fields[i]]) {
					return true;
				}
			}
			return false;
		}
		function wasChangedNotEmpty(obj) {
			for (var i = fields.length - 1; i >= 0; i--) {
				if(obj[fields[i]] && obj[fields[i]+'Bak'] != obj[fields[i]]) {
					return true;
				}
			}
			return false;
		}
	}

	function seconds2timeFilter(){
		return function(seconds){
			var minutes = Math.floor(seconds / 60);
			var hours;
			if (minutes >= 60) {
				hours = Math.floor(minutes / 60);
				hours = hours >= 10 ? hours : "0" + hours;
				minutes = minutes % 60;
			} else {
				hours = 0;
			}
			minutes = (minutes >= 10 || !hours) ? minutes : "0" + minutes;
			seconds = Math.floor(seconds % 60);
			seconds = (seconds >= 10) ? seconds : "0" + seconds;
			return (hours > 0 ? hours + ":" :'') + minutes + ":" + seconds;
		};
	}

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


