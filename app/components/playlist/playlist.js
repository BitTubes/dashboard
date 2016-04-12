(function() {
	"use strict";
	angular
		.module('bt.dashboard')
		.controller('playlistController', playlistController);


	playlistController.$inject = ['http','$scope', '$uibModal','i18n','notification','Auth'];
	function playlistController(http, $scope, $uibModal, _, note, Auth) {
		/* jshint validthis:true */
		var vm = this;
		vm.delete = del;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.orderByField = 'Name';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function del(pl) {
			$scope.delObj = pl;
			$scope.Name = pl["button"];
			$scope.title = _('playlist',1);
			$scope.deleteWarning = false;

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'common/del.html',
				controller: 'deleteModalCtrl',
				scope: $scope,
				size: null
			});

			modalInstance.result.then(del_db, modal_dismissed);
		}


		/////////////////////


		function initView() {
			http.post($scope.uriApiVideo+'getPlaylistsCms', { 'api': $scope.API })
			.then(function(response){
				$scope.PLAYLISTS = response.data;
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function modal_dismissed() {
			// console.info('Modal dismissed at: ' + new Date());
		}
		function del_db(pl) {
			// update DB
			http.post($scope.uriApiVideo+'deletePlaylist', {
				'api': $scope.API,
				// 'a':'deletePlaylist',
				'p':pl["ID"]
			})
			.then(function(response){
				if(response.data !== true && response.data !== "true") {
					note.error(_('note_dberror'));
					return;
				}
				note.ok(_('note_xdeleted',0,_('playlist',1)+' '+pl['button']));

				// remove from local data cache & UI
				var removeIndex = $scope.PLAYLISTS.indexOf(pl);
				if (removeIndex > -1) {
					$scope.PLAYLISTS.splice(removeIndex, 1);
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
	}

})();
