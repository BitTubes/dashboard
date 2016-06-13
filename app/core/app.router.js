(function() {
	'use strict';

	var DEFAULT_ROUTE = 'videos.list';
	var DEFAULT_URL = '/video';
	var DEFAULT_API = 'demo';
	var BASE_HREF = '/dashboard';
	var CLASS_LAYOUT_FIXED = 'container';
	var CLASS_LAYOUT_FLUID = 'container-fluid';
	var tabs;

	angular
		.module('bt.dashboard')
		.config(appConfig)
		.run(appRun);


	appConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider'];
	/**
	 * THE app-config
	 *
	 * @param  {angularJs} $stateProvider     angularJs
	 * @param  {angularJs} $locationProvider  angularJs
	 * @param  {angularJs} $urlRouterProvider angularJs
	 * @param  {angularJs} $httpProvider      angularJs
	 * no @return
	 */
	function appConfig($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
		// remove hashtag (requires server-side rewrites!)
		// $locationProvider.html5Mode(true);

		// change http defaults
		// $httpProvider.defaults.withCredentials = true;
		$httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';

		// select default
		// $urlRouterProvider.otherwise(DEFAULT_URL);
		$urlRouterProvider.otherwise(function($injector) {
			var $state = $injector.get('$state');
			var $rootScope = $injector.get('$rootScope');
			var store = $injector.get('store');



			if(!$rootScope.stateChanged) {
				// app just loaded with an invalid state
				var lastView = store.get('lastView');
				// check if saved state is still valid
				if(!!lastView && !!lastView['state']) {
					var stateConfig = $state.get(lastView['state']);
					if(stateConfig && !stateConfig.abstract) {
						// last view found and evaluated as valid -> go there
						return $state.go(lastView['state'], lastView['params']);
					}
				}
			}
			// fallback, go to default state
			$state.go(DEFAULT_ROUTE);
		});
		/**
		 * simple wrapper for adding all states
		 *
		 * @param {Object} tabList
		 */
		function addStates(tabList) {
			for(var i = 0; i < tabList.length; i++) {
				if(tabList[i].external) {
					continue;
				}
				$stateProvider.state(tabList[i]['state'], tabList[i]);
				if(tabList[i].subviews) {
					addStates(tabList[i].subviews);
				}
			}
		}
		for(var types in tabs) {
			addStates(tabs[types]);
		}
	}

	appRun.$inject = ['$rootScope', '$location', '$window', 'Auth', 'i18n', 'store'];
	/**
	 * THE app-run function
	 *
	 * @param  {angularJs} $rootScope angularJs
	 * @param  {angularJs} $location  angularJs
	 * @param  {angularJs} $window    angularJs
	 * @param  {angularJs} Auth       app.auth
	 * @param  {angularJs} _          jb.i18n
	 * @param  {angularJs} store      angular-storage
	 * no @return
	 */
	function appRun($rootScope, $location, $window, Auth, _, store) {
		// globals
		// - API
		var server = 'https://nlv.bittubes.com/api/';
		$rootScope.uriApiAnalyzer = server + 'analyzer/1/';
		$rootScope.uriApiCms = server + 'cms/2/';
		$rootScope.uriApiPost = server + 'post/4/';
		$rootScope.uriApiVideo = server + 'meta/13/';
		// - patterns used for login and add/edit user
		$rootScope.loginMax = 50;
		$rootScope.loginMin = 5;
		$rootScope.loginPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		$rootScope.passwordMax = 24;
		$rootScope.passwordMin = 8;
		$rootScope.passwordPattern = /^[.a-zA-Z0-9_-]*$/;

		$rootScope.DEFAULT_API = DEFAULT_API;
		$rootScope.DEFAULT_ROUTE = DEFAULT_ROUTE;
		$rootScope.DEFAULT_URL = DEFAULT_URL;
		$rootScope.BASE_HREF = BASE_HREF;
		$rootScope.tabs = tabs;

		$rootScope.containerClass = CLASS_LAYOUT_FIXED;

		/*eslint angular/on-watch: 0*/
		// listener for UI-Router, Auth, ...
		$rootScope.$on('$stateChangeStart', stateChangeStart);
		// listeners for Google Analytics
		$rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

		// initialise Google Analytics
		$window.ga('create', 'UA-23776265-2', 'auto');


		////////////////////////////////////


		/**
		 * $stateChangeSuccess listener
		 *
		 * @param  {Object} event      angularJs
		 * @param  {Object} toState    angularJs
		 * @param  {Object} toParams   angularJs
		 * no @return
		 */
		function stateChangeSuccess(event, toState, toParams) { /*, fromState, fromParams) {*/
			// track pageview on state change
			// https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications#overview
			$window.ga('set', 'page', $rootScope.BASE_HREF + stripParamsFromUrl(toState, toParams));
			$window.ga('set', 'title', $rootScope.pageTitleGA);
			$window.ga('set', 'dimension1', $rootScope.API || '-');
			$window.ga('set', 'dimension2', $rootScope.locale || '-');
			$window.ga('send', 'pageview');
		}
		/**
		 * used for GA to post the path with param-names instead of param-values
		 *
		 * @param  {Object} state  toState
		 * @param  {Object} params toParams
		 * @return {string}
		 */
		function stripParamsFromUrl(state, params) {
			var updateUrl = false;
			for(var el in params) {
				if(params[el]) {
					updateUrl = true;
					break;
				}
			}
			if(!updateUrl) {
				return $location.path();
			}
			var locationPath = $location.path().split('/');
			var page = state.url.split('/');
			for(var i = page.length - 1, ii = locationPath.length - 1; i >= 0; i--, ii--) {
				if(page[i].indexOf(':') === 0) {
					locationPath[ii] = page[i];
				}
			}

			return locationPath.join('/');
		}

		/**
		 * $stateChangeStart listener
		 *
		 * @param  {Object} event      angularJs
		 * @param  {Object} toState    angularJs
		 * @param  {Object} toParams   angularJs
		 * @param  {Object} fromState  angularJs
		 * @param  {Object} fromParams angularJs
		 * no @return
		 */
		function stateChangeStart(event, toState, toParams, fromState, fromParams) {
			// get auth-status
			var authenticated = Auth.isAuthenticated();
			// set stateChanged to track if we are onLoad or mid-app (for otherwise-state switcher)
			$rootScope.stateChanged = true;

			if(!toState.public && !authenticated) {
				// not authenticated but trying to access a private view
				var promise = Auth.tryReauthentication();
				if(!promise) {
					Auth.showLogin(toState, toParams);
				} else {
					promise.then(function() {
						Auth.redirect(toState, toParams);
					}, function() {
						Auth.showLogin(toState, toParams);
					});
				}
				event.preventDefault();

				return;
			} else if(toState.state === 'login' && authenticated) {
				// authenticated but trying to access the login view
				Auth.redirect();
				event.preventDefault();

				return;
			}
			if(toState.admin && !$rootScope.ME['user']['admin']) {
				// authenticated & not an admin but trying to access an admin view
				Auth.redirect(fromState.state, fromParams);
				event.preventDefault();

				return;
			}

			if(toState.fluidLayout) {
				$rootScope.containerClass = CLASS_LAYOUT_FLUID;
			} else {
				$rootScope.containerClass = CLASS_LAYOUT_FIXED;
			}

			// set lastView for otherwise-state switcher
			if(!toState.public) {
				store.set('lastView', {'state': toState.state, 'params': toParams});
			}
			// udpate website title
			$rootScope.pageTitle = _(toState.title, 2, toState.titleReplacement);
			// adapt the title for Google Analytics
			$rootScope.pageTitleGA = 'Dashboard: ' + $rootScope.pageTitle;
		}
	}


	tabs = {
		app: [
			{
				state: 'users',
				title: 'user',
				url: '/user/:editme',
				templateUrl: 'components/user/user.html',
				controller: 'UserController',
				controllerAs: 'userCtrl'
			},
			{
				state: 'videos',
				abstract: true,
				title: 'video',
				url: '/video',
				// templateUrl: 'components/videos/videos.html',
				template: '<ui-view/>',
				subviews: [
					{
						state: 'videos.list',
						title: 'video',
						url: '',
						templateUrl: 'components/video/video.list.html',
						controller: 'VideoController',
						controllerAs: 'videoCtrl'
					},
					{
						state: 'videos.moderate',
						title: 'moderation',
						url: '/:id/moderate',
						templateUrl: 'components/video/video.moderate.html',
						controller: 'VideoModController',
						controllerAs: 'videoModCtrl'
					},
					{
						state: 'videos.config',
						title: 'Video Config',
						url: '/:id/config',
						templateUrl: 'components/video/video.config.html',
						controller: 'VideoConfigController',
						controllerAs: 'videoConfigCtrl'
					},
					{
						state: 'videos.config-org',
						title: 'Video Config',
						url: '/config',
						templateUrl: 'components/video/video.config.html',
						controller: 'VideoConfigController',
						controllerAs: 'videoConfigCtrl'
					}
				]
			},
			{
				state: 'playlists',
				title: 'playlist',
				url: '/playlist',
				templateUrl: 'components/playlist/playlist.html',
				controller: 'PlaylistController',
				controllerAs: 'playlistCtrl'
			},
			{
				state: 'analyzer',
				external: true,
				title: 'analyzer',
				url: '/analyzer',
			}
		],
		hidden: [
			{
				public: true,
				state: 'login',
				title: 'login',
				url: '/login/:redirect',
				templateUrl: 'core/login.html',
				controller: 'LoginController',
				controllerAs: 'loginCtrl'
			},
			{
				public: true,
				state: 'forgotpw',
				title: 'resetx',
				titleReplacement: 'password',
				url: '/forgot-password/:token',
				templateUrl: 'core/forgotpw.html',
				controller: 'ForgotPwController',
				controllerAs: 'forgotPwCtrl'
			},
			{
				public: true,
				state: 'setpw',
				title: 'setx',
				titleReplacement: 'password',
				url: '/set-password/:token',
				templateUrl: 'core/forgotpw.html',
				controller: 'ForgotPwController',
				controllerAs: 'forgotPwCtrl'
			},
			{
				public: false,
				state: 'developer',
				title: 'developer',
				url: '/developer',
				templateUrl: 'components/developer/developer.html',
				controller: 'DevController',
				controllerAs: 'devCtrl'
			}
		],
		admin: [
			{
				state: 'customers',
				admin: true,
				title: 'customer',
				url: '/admin/customer',
				templateUrl: 'components/admin/customer/customer.list.html',
				controller: 'CustomerController',
				controllerAs: 'customerCtrl'
			},
			{
				state: 'monitoring',
				admin: true,
				fluidLayout: true,
				title: 'monitoring',
				url: '/admin/monitoring',
				templateUrl: 'components/admin/monitoring/monitoring.html',
				controller: 'MonitoringController',
				controllerAs: 'monitoringCtrl'
			},
			{
				state: 'config',
				abstract: true,
				title: 'Config',
				url: '/admin/config',
				template: '<ui-view/>',
				subviews: [
					{
						state: 'config.list',
						admin: true,
						title: 'Config',
						url: '',
						templateUrl: 'components/admin/config/config.html',
						controller: 'ConfigController',
						controllerAs: 'configCtrl'
					},
					{
						state: 'config.define',
						admin: true,
						title: 'Config',
						url: '/define/:id',
						templateUrl: 'components/admin/config/config.define.html',
						controller: 'ConfigDefineController',
						controllerAs: 'configDefCtrl'
					}
				]
			},
			{
				state: 'xcopy',
				admin: true,
				title: 'copyx',
				titleReplacement: 'video',
				url: '/admin/xcopy',
				templateUrl: 'components/admin/xcopy/xcopy.html',
				controller: 'XcopyController',
				controllerAs: 'xcopyCtrl'
			},
			{
				state: 'sql',
				admin: true,
				title: 'SQL Query',
				url: '/admin/sql',
				templateUrl: 'components/admin/sql/sql.html',
				controller: 'SqlController',
				controllerAs: 'sqlCtrl'
			},
			{
				state: 'pma',
				admin: true,
				external: true,
				title: 'phpMyAdmin',
				url: '/dev/pma/',
			}
		]
	};

})();
