(function() {
	'use strict';
	angular.module('bt.dashboard')
		.controller('XcopyController', XcopyController);
		// .controller('xcopyWaitController', xcopyWaitController);


	XcopyController.$inject = ['http','$scope', '$filter', 'i18n', 'notification', 'Auth', 'waiting'];
	function XcopyController(http, $scope, $filter, _, note, Auth, waiting) {
		/* jshint validthis:true */
		var vm = this;
		vm.apiFrom = null;
		vm.apiTo = null;
		vm.updateFromVideos = updateFromVideosDb;
		vm.updateToVideo = updateToVideo;
		vm.videoFromObj = null;
		vm.videoToObj = {};
		vm.videosFrom = [];
		vm.xcopy = xcopyDb;

		$scope.getGroup = getGroup;


		/////////////////////


		function getGroup(isPublic) {
			return isPublic ? 'Public' : 'Hidden';
		}
		function updateFromVideosDb() {
			if(!vm.apiFrom) {
				vm.videosFrom = [];
				return;
			}
			http.post($scope.uriApiVideo + 'getVideoList', {'api': vm.apiFrom})
			.then(function(response) {
				vm.videosFrom = response.data['Media'];
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function updateToVideo() {
			vm.videoToObj = {};

			if(vm.videoFromObj) {
				vm.videoToObj['Name'] = vm.videoFromObj['Name'] + ' - Copy ' + $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
			}
		}
		function xcopyDb() {
			waiting.show(_('wait_addingx',null,'video'), _('wait_takex',null,['5',_('t_minute',5)]));


			var params = {'api': vm.apiFrom, 'p':vm.videoFromObj['UID']};
			if(vm.apiFrom !== vm.apiTo) {
				params['p2'] = vm.apiTo;
			}

			// update DB
			http.post($scope.uriApiVideo + 'copyVideoUID', params)
			.then(function(response) {
				waiting.hide();

				var data = response.data;
				if(!data || (data && data['error'] && data['error'].length)) {
					note.error(_('note_dberror'));
					return;
				}
				note.ok(_('note_xadded',0,_('video',1) + ' ' + data['Name']));

			},
			Auth.checkHttpStatus.bind(Auth));
		}
	}

})();
