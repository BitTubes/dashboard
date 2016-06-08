(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.controller('VideoController', VideoController);


	VideoController.$inject = ['http', '$scope', '$uibModal', 'i18n', 'notification', 'Auth'];
	function VideoController(http, $scope, $uibModal, _, note, Auth) {
		/* jshint validthis:true */
		var vm = this;
		vm.delete = del;
		vm.publish = publishDb;
		vm.VIDEOS = null;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.orderByField = 'Name';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function publishDb(video) {
			// update DB
			video.publishPromise = http.post($scope.uriApiVideo + 'updatePublic', {'api': $scope.API, 'p': video['ID'], 'p2': video['Public'] ? 0 : 1})
			.then(function() {
				// update local data cache & UI
				video['Public'] = video['Public'] ? 0 : 1;

				note.info(_('note_published' + video['Public'], 0, _('video', 0)));

				return;
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function del(video) {
			$scope.deleteWarning = false;
			$scope.Name = video['Name'];
			$scope.title = _('video', 1);
			$scope.delObj = video;

			// note.debug("add check if I'm deleteting myself and display warning if I am");

			// console.log('delete', user['ID']);
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/del.html',
				controller: 'DeleteModalController',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(_delDb, _modalDismissed);
		}


		/////////////////////


		function initView() {
			http.post($scope.uriApiVideo + 'getVideoList', {'api': $scope.API})
			.then(function(response) {
				vm.VIDEOS = response.data['Media'];
				http.post($scope.uriApiPost + 'getAllPosts', {'api': $scope.API})
				.then(function(response) {
					var posts = response.data;
					for(var video, vid, i = vm.VIDEOS.length - 1; i >= 0; i--) {
						video = vm.VIDEOS[i];
						vid = video['ID'];
						if(posts[vid]) {
							video['posts'] = posts[vid][0];
							video['lastpost'] = posts[vid][1];
						} else {
							video['posts'] = 0;
							video['lastpost'] = '';
						}
					}
				},
				Auth.checkHttpStatus.bind(Auth));
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _modalDismissed() {
			// console.info('Modal dismissed at: ' + new Date());
		}
		function _delDb(video) {
			// update DB
			video.delPromise = http.post($scope.uriApiVideo + 'deleteVideo', {'api': $scope.API, 'p': video['ID']})
			.then(function(response) {
				var data = response.data;
				if(data !== true && data !== 'true') {
					// alert("error updating database");
					note.error(_('note_dberror'));

					return;
				}
				note.ok(_('note_xdeleted', 0, _('video', 1) + ' ' + video['Name']));

				// remove from local data cache
				var removeIndex = vm.VIDEOS.indexOf(video);
				if(removeIndex > -1) {
					vm.VIDEOS.splice(removeIndex, 1);
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
	}

})();
