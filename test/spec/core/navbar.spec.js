'use strict';

describe('navbarController', function () {

	// load the controller's module
	beforeEach(module('bt.dashboard'));

	var vm,
		scope,
		rootScope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		rootScope = $rootScope;
		vm = $controller('navbarController', {
			$scope: scope
			// place here mocked dependencies
		});
	}));

	it('should attach a list of awesomeThings to the scope', function () {
		expect(vm.tab.length).toBe(rootScope.tabs.app);
	});
});

