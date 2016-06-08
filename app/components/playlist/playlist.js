(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.controller('PlaylistController', PlaylistController);


	PlaylistController.$inject = ['http', '$scope', '$uibModal', 'i18n', 'notification', 'Auth'];
	function PlaylistController(http, $scope, $uibModal, _, note, Auth) {
		/* jshint validthis:true */
		var vm = this;
		vm.delete = del;
		vm.reload = initView;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.loadPromise = null;
		$scope.reload = initView;
		$scope.orderByField = 'Name';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function del(pl) {
			$scope.delObj = pl;
			$scope.Name = pl['button'];
			$scope.title = _('playlist', 1);
			$scope.deleteWarning = false;

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
			$scope.loadPromise = http.post($scope.uriApiVideo + 'getPlaylistsCms', {'api': $scope.API})
			.then(function(response) {
				$scope.PLAYLISTS = response.data;
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function _modalDismissed() {
			// console.info('Modal dismissed at: ' + new Date());
		}
		function _delDb(pl) {
			// update DB
			http.post($scope.uriApiVideo + 'deletePlaylist', {
				'api': $scope.API,
				'p': pl['ID']
			})
			.then(function(response) {
				if(response.data !== true && response.data !== 'true') {
					note.error(_('note_dberror'));

					return;
				}
				note.ok(_('note_xdeleted', 0, _('playlist', 1) + ' ' + pl['button']));

				// remove from local data cache & UI
				var removeIndex = $scope.PLAYLISTS.indexOf(pl);
				if(removeIndex > -1) {
					$scope.PLAYLISTS.splice(removeIndex, 1);
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
	}

})();
