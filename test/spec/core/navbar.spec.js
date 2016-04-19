describe('navbarController', function() {
	beforeEach(module('bt.dashboard'));

	var $controller;
	var $rootScope;
	var $state;
	var store;
	var note;

	beforeEach(inject(function(_$controller_, _$rootScope_, _notification_, _$state_, _store_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		$state = _$state_;
		store = _store_;
		note = _notification_;
	}));

	describe('vm.changeAccount()', function() {
		var $scope = {},
			vm,
			demoAccount = {
				ID: 1,
				api: 'demo',
				created: "2011-07-07 14:45:27",
				last_login: null,
				name: "DEMO",
				users: 0
			},
			fakeAccount = {
				ID: 2,
				api: 'fake',
				created: "2016-07-07 14:45:27",
				last_login: null,
				name: "FAKE",
				users: 0
			};

		beforeEach(function() {
			$scope = {};
			vm = $controller('navbarController', { $scope: $scope });
			spyOn(note, "info").and.returnValue(true);
			spyOn($state, "reload").and.returnValue(true);
		});

		it('navbar should be collapsed', function() {
			vm.navCollapsed = false;
			vm.changeAccount(demoAccount);
			expect(vm.navCollapsed).toEqual(true);
		});

		it('current stored account should be "demoAccount"', function() {
			vm.changeAccount(fakeAccount);
			vm.changeAccount(demoAccount);
			expect(store.get('account')).toEqual(demoAccount);
		});

		it('current account in $rootScope.API should be "demo"', function() {
			vm.changeAccount(fakeAccount);
			vm.changeAccount(demoAccount);
			expect($rootScope.API).toEqual("demo");
		});

	});
});
