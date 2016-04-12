(function() {
	"use strict";
	angular.module('bt.dashboard')
		.controller('xcopyController', xcopyController);
		// .controller('xcopyWaitController', xcopyWaitController);


	xcopyController.$inject = ['http','$scope', '$filter', 'i18n', 'notification', 'Auth', 'waiting'];
	function xcopyController(http, $scope, $filter, _, note, Auth, waiting) {
		/* jshint validthis:true */
		var vm = this;
		vm.api_from = null;
		vm.api_to = null;
		vm.updateFromVideos = updateFromVideos_db;
		vm.updateToVideo = updateToVideo;
		vm.video_from_obj = null;
		vm.video_to_obj = {};
		vm.videos_from = [];
		vm.xcopy = xcopy_db;

		$scope.getGroup = getGroup;


		/////////////////////


		function getGroup(isPublic) {
			return isPublic ? 'Public' : 'Hidden';
		}
		function updateFromVideos_db() {
			// console.log("updateFromVideos");
			// note.debug('updateFromVideos() not defined');
			if(!vm.api_from) {
				vm.videos_from = [];
				return;
			}
			http.post($scope.uriApiVideo+'getVideoList', { 'api': vm.api_from })
			.then(function(response){
				// var data = response.data;
				vm.videos_from = response.data['Media'];
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function updateToVideo() {
			console.log("updateToVideo");
			vm.video_to_obj = {};

			if(vm.video_from_obj) {
				vm.video_to_obj['Name'] = vm.video_from_obj['Name'] + ' - Copy '+$filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
			}
		}
		function xcopy_db() {
			waiting.show(_('wait_addingx',null,'video'), _('wait_takex',null,['5',_('t_minute',5)]));


			var params = { 'api': vm.api_from, 'p':vm.video_from_obj['UID'] };
			if(vm.api_from !== vm.api_to) {
				params['p2'] = vm.api_to;
			}

			// update DB
			http.post($scope.uriApiVideo+'copyVideoUID', params)
			.then(function(response){
				waiting.hide();

				var data = response.data;
				if(!data || (data && data['error'] && data['error'].length)) {
					// alert("error updating database");
					note.error(_('note_dberror'));
					return;
				}
				note.ok(_('note_xadded',0,_('video',1)+' '+data['Name']));

			},
			Auth.checkHttpStatus.bind(Auth));
		}
	}

	// xcopyWaitController.$inject = ['$scope','i18n'];
	// function xcopyWaitController($scope, _) {
	// 	$scope.msg_waiting = _('wait_addingx',null,'video');
	// 	$scope.msg_taketime = _('wait_takex',null,['5',_('minute',5)]);
	// }

})();
