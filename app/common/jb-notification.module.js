(function() {
	'use strict';
	angular
		.module('jb.notification', ['jb.i18n'])
		.directive('notification', notificationDirective)
		.directive('topNotification', topNotificationDirective)
		.factory('notification', notificationFactory);



	notificationFactory.$inject = ['$rootScope','$timeout', 'i18n'];
	/**
	 * factory
	 *
	 * @param  {angularJs} $rootScope
	 * @param  {angularJs} $timeout
	 * @param  {jbI18n} _
	 * @return {Object} service functions
	 */
	function notificationFactory($rootScope, $timeout, _) {
		var insertBelow = false;

		var service = {
			debug: debug,
			info: info,
			ok: ok,
			warn: warn,
			error: error,
			_test: {
				set insertBelow(bool) { /*getter not required for test*/
					insertBelow = bool;
				}
			}
		};

		return service;


		//////////////////////////


		/**
		 * wrapper for show()
		 *
		 * @param  {string} msg
		 * no @return
		 */
		function debug(msg) {
			show('warning',msg, 'TODO', true);
		}
		/**
		 * wrapper for show()
		 *
		 * @param  {string} msg
		 * no @return
		 */
		function info(msg) {
			show('info',msg, '');
		}
		/**
		 * wrapper for show()
		 *
		 * @param  {string} msg
		 * no @return
		 */
		function ok(msg) {
			show('success',msg, '');
		}
		/**
		 * wrapper for show()
		 *
		 * @param  {string} msg
		 * no @return
		 */
		function warn(msg) {
			show('warning',msg, _('warning'));
		}
		/**
		 * wrapper for show()
		 *
		 * @param  {string} msg
		 * no @return
		 */
		function error(msg) {
			show('danger', msg, _('error'));
		}

		/**
		 * shows a notification
		 *
		 * @param  {string} type
		 * @param  {string} msg
		 * @param  {string} title
		 * @param  {boolean} [top]
		 * no @return
		 */
		function show(type, msg, title, top) {
			var timeout;
			switch(type) {
				case 'success': /*no break here*/
				case 'info':
					timeout = 3;
				break;
				case 'warning': /*no break here*/
				case 'danger':
					timeout = 6;
				break;
			}
			var newAlert = {
				class: 'alert-' + type,
				title: title,
				msg: msg,
				show: true,
				top: top ? true : false
			};
			var arr;
			if(top) {
				arr = $rootScope.jbNotificationsTop;
			} else {
				arr = $rootScope.jbNotifications;
			}
			if(insertBelow) {
				arr.push(newAlert);
			} else {
				arr.unshift(newAlert);
			}

			$timeout(function() {
				// slide out message
				newAlert.show = false;

				// clean up alert record and thereby remove it from the DOM a bit later
				$timeout(function() {
					var index = arr.indexOf(newAlert);
					if(index > -1) {
						arr.splice(index, 1);
					}
				}, 3000);
			}, timeout * 1000);

		}
	}

	/**
	 * directive
	 *
	 * @return {object}
	 */
	function notificationDirective() {
		return {
			restrict: 'E',
			// templateUrl: "common/jb-notification.html",
			template: '<div ng-repeat="alert in jbNotifications" class="alert" ng-class="[alert.class,{\'alert-hide\': !alert.show}]" role="alert"><strong ng-show="alert.title">{{alert.title}}: </strong>{{alert.msg}}</div>',
			controller: ['$rootScope',function($rootScope) {
				$rootScope.jbNotifications = $rootScope.jbNotifications || [];
			}]
		};
	}
	/**
	 * directive
	 *
	 * @return {object}
	 */
	function topNotificationDirective() {
		return {
			restrict: 'E',
			// templateUrl: "common/jb-notification-top.html",
			template: '<div ng-repeat="alert in jbNotificationsTop" class="alert" ng-class="[alert.class,{\'alert-hide\': !alert.show}]" role="alert"><strong ng-show="alert.title">{{alert.title}}: </strong>{{alert.msg}}</div>',
			controller: ['$rootScope',function($rootScope) {
				$rootScope.jbNotificationsTop = $rootScope.jbNotificationsTop || [];
			}]
		};
	}

})();


