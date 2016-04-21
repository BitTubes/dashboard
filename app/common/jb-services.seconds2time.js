(function() {
	"use strict";
	angular
		.module('jb.services')
		.filter('seconds2time', seconds2timeFilter);



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



})();


