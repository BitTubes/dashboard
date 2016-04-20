describe('Module jb.notification', function() {
	"use strict";

	beforeEach(module('jb.notification'));

	var myFactory;
	var $rootScope;
	var $timeout;

	beforeEach(inject(function($injector, _$rootScope_, _$timeout_){
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;
		myFactory = $injector.get("notification");

		$rootScope.jbNotificationsTop = [];
		$rootScope.jbNotifications = [];
	}));

	it('should add 1 entry to global array and remove it after the timeout', function() {
		myFactory.info("info");
		myFactory.ok("ok");
		myFactory.warn("warn");
		myFactory.info("info");
		expect($rootScope.jbNotifications.length).toEqual(4);
		expect($rootScope.jbNotificationsTop.length).toEqual(0);
		// the factory uses 2 timeouts, the first to hide the notification visually...
		$timeout.flush();
		// ... and the second to actually remove it from the array
		$timeout.flush();
		expect($rootScope.jbNotifications.length).toEqual(0);
		expect($rootScope.jbNotificationsTop.length).toEqual(0);
	});

	it('should add 1 entry to global dev-array and remove it after the timeout', function() {
		myFactory.debug("debug");
		expect($rootScope.jbNotifications.length).toEqual(0);
		expect($rootScope.jbNotificationsTop.length).toEqual(1);
		// the factory uses 2 timeouts, the first to hide the notification visually...
		$timeout.flush();
		// ... and the second to actually remove it from the array
		$timeout.flush();
		expect($rootScope.jbNotifications.length).toEqual(0);
		expect($rootScope.jbNotificationsTop.length).toEqual(0);
	});

});
