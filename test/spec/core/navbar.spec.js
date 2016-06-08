describe('Controller: navbar', function() {
	'use strict';
	beforeEach(module('bt.dashboard'));

	var $controller;
	var $window;
	var $rootScope;
	var $state;
	var Auth;
	var i18n;
	var store;
	var note;

	beforeEach(inject(function(_$controller_, _$window_, _$rootScope_, _$state_, _Auth_, _i18n_, _store_, _notification_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
		$window = _$window_;
		$window.ga = function() {};
		// window.ga = function() {};
		$rootScope = _$rootScope_;
		$state = _$state_;
		Auth = _Auth_;
		i18n = _i18n_;
		note = _notification_;
		store = _store_;

		// spyOn(window, 'ga').and.callFake(function() {});
		spyOn($window, 'ga').and.callFake(function() {});
	}));

	describe('vm.changeAccount()', function() {
		var $scope;
		var	vm;
		// var demoAccount = {
		// 		ID: 1,
		// 		api: 'demo',
		// 		created: '2011-07-07 14:45:27',
		// 		'last_login': null,
		// 		name: 'DEMO',
		// 		users: 0
		// 	};
		// var fakeAccount = {
		// 		ID: 2,
		// 		api: 'fake',
		// 		created: '2016-07-07 14:45:27',
		// 		'last_login': null,
		// 		name: 'FAKE',
		// 		users: 0
		// 	};

		beforeEach(function() {
			$scope = $rootScope.$new();
			// $window.ga = function() {};
			// spyOn($window, 'ga').and.callFake(function() {});
			vm = $controller('navbarController', {$scope: $scope});
			// vm = $controller('navbarController', {$rootScope: $rootScope, $state: $state, Auth: Auth, i18n: i18n, note: note, store: store});
			spyOn(note, 'info').and.returnValue(true);
			spyOn($state, 'reload').and.returnValue(true);
		});

		// it('navbar should be collapsed', function() {
		// 	vm.navCollapsed = false;
		// 	vm.changeAccount(demoAccount);
		// 	expect(vm.navCollapsed).toEqual(true);
		// });

		// it('current stored account should be "demoAccount"', function() {
		// 	vm.changeAccount(fakeAccount);
		// 	vm.changeAccount(demoAccount);
		// 	expect(store.get('account')).toEqual(demoAccount);
		// });

		// it('current account in $rootScope.API should be "demo"', function() {
		// 	vm.changeAccount(fakeAccount);
		// 	vm.changeAccount(demoAccount);
		// 	expect($rootScope.API).toEqual('demo');
		// });

	});
});
