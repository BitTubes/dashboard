(function() {
	"use strict";
	angular
		.module('jb.notification', ['jb.i18n'])
		.directive("notification", notificationDirective)
		.directive("topNotification", topNotificationDirective)
		.factory('notification', notificationFactory);



	notificationFactory.$inject = ['$rootScope','$timeout', 'i18n'];
	function notificationFactory($rootScope, $timeout, _){

		var insertBelow = false;

		var $return = {
			debug: function(msg) {
				show('warning',msg, 'TODO', true);
			},
			info: function(msg) {
				show('info',msg, '');
			},
			ok: function(msg) {
				show('success',msg, '');
			},
			warn: function(msg) {
				show('warning',msg, _('warning'));
			},
			error: function(msg) {
				show('danger', msg, _('error'));
			},
			_test: {
				set insertBelow(bool) {
					insertBelow = bool;
				}
			}
		};

		return $return;



		function show(type, msg, title, top) {
			var timeout;
			switch(type) {
				case 'success':
				case 'info': /* no break here */
					timeout = 3;
				break;
				case 'warning':
				case 'danger':
					timeout = 6;
				break;
			}
			var newAlert = {
				class: 'alert-'+type,
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

			$timeout(function(){
				// slide out message
				newAlert.show = false;

				// clean up alert record and thereby remove it from the DOM a bit later
				$timeout(function(){
					var index = arr.indexOf(newAlert);
					if (index > -1) {
						arr.splice(index, 1);
					}
				}, 3000);
			}, timeout*1000);

		}
	}


	function notificationDirective() {
		return {
			restrict: "E",
			// templateUrl: "common/jb-notification.html",
			template: '<div ng-repeat="alert in jbNotifications" class="alert" ng-class="[alert.class,{\'alert-hide\': !alert.show}]" role="alert"><strong ng-show="alert.title">{{alert.title}}: </strong>{{alert.msg}}</div>',
			controller: ['$rootScope',function($rootScope) {
				$rootScope.jbNotifications = $rootScope.jbNotifications || [];
			}]
		};
	}
	function topNotificationDirective() {
		return {
			restrict: "E",
			// templateUrl: "common/jb-notification-top.html",
			template: '<div ng-repeat="alert in jbNotificationsTop" class="alert" ng-class="[alert.class,{\'alert-hide\': !alert.show}]" role="alert"><strong ng-show="alert.title">{{alert.title}}: </strong>{{alert.msg}}</div>',
			controller: ['$rootScope',function($rootScope) {
				$rootScope.jbNotificationsTop = $rootScope.jbNotificationsTop || [];
			}]
		};
	}

})();


