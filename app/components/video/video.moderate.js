(function() {
	'use strict';
	angular
		.module('bt.dashboard')
		.controller('VideoModController', VideoModController);


	VideoModController.$inject = ['http', '$scope', '$stateParams', 'i18n', 'notification', 'Auth'];
	function VideoModController(http, $scope, $stateParams, _, note, Auth) {
		/* jshint validthis:true */
		var vm = this;
		var videoId = $stateParams.id;
		vm.availstatus = [
			{val: 2, name: _('post_status2')},
			{val: 1, name: _('post_status1')},
			// {val: 0, name: 'new'},
			{val: -1, name: _('post_status-1')},
			{val: -2, name: _('post_status-2')}
		];
		vm.Name = null;
		vm.POSTS = null;
		vm.updateStatus = updateStatusDb;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.loadPromise = null;
		$scope.reload = initView;
		$scope.orderByField = 'video_time';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function updateStatusDb(post) {
			// update DB
			http.post($scope.uriApiPost, {'api': $scope.API, 'a': 'updateStatus', 'p': post.ID, 'p2': post.status})
			.then(function() {
				note.info(_('note_statuschg'));
			},
			Auth.checkHttpStatus.bind(Auth));
		}


		/////////////////////


		function initView() {
			// get video name
			http.post($scope.uriApiVideo + 'getVideo', {'api': $scope.API, 'p': videoId})
			.then(function(response) {
				vm.Name = response.data['Name'];
			},
			Auth.checkHttpStatus.bind(Auth));

			// get posts for chosen video
			$scope.loadPromise = http.post($scope.uriApiPost + 'getPostList', {'api': $scope.API, 'p': videoId, 'p2': 0, 'p3': 1})
			.then(function(response) {
				vm.POSTS = response.data['posts'];
			},
			Auth.checkHttpStatus.bind(Auth));
		}
	}

})();
