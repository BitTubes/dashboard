describe('Directive: btn-spinner', function() {
	"use strict";
	// load the directive's module
	beforeEach(module('bt.dashboard'));
	beforeEach(module('my.templates'));

	var element;
	var linker;
	var scope;
	var $compile;
	var $body;
	var html;
	var $rootScope;
	var $q;

	beforeEach(inject(function(_$rootScope_, _$compile_, _$q_) {
		$rootScope = _$rootScope_;
		scope = $rootScope.$new();
		$compile = _$compile_;
		$q = _$q_;
		// $httpBackend.expectGET('/locales/jb-i18n-de.json').respond({});
		// $httpBackend.expectGET('i18n/de.json').respond({});
		// $body = angular.element(document).find('body');
		// $body.empty();
		html = '<form name="testForm">' +
							'<button id="testbutton" btn-spinner="spinner" ng-disabled="{{disabled}}">Testbutton</button>' +
					 '</form>';
		// element = angular.element(html);
		linker = $compile(html);
		element = linker(scope);
	}));

	// it('It should prepend a spinner if a truthy value is bound to the directive', function() {
	// 	scope.spinner = true;

	// 	scope.$digest();

	// 	var firstChild = element.find('button').eq(0).children().eq(0);

	// 	expect(firstChild.hasClass('icons-spinner')).toBe(true);
	// });

	// it('It should remove the spinner if a falsy value is bound to the directive', function() {
	// 	scope.spinner = true;

	// 	scope.$digest();

	// 	scope.spinner = false;

	// 	scope.$digest();

	// 	var children = element.find('button').eq(0).children();

	// 	expect(children.length).toBe(0);
	// });

	// it('It should show the spinner if a promise is bound to the directive', function() {
	// 	scope.spinner = $q.defer().promise;

	// 	scope.$digest();

	// 	var firstChild = element.find('button').eq(0).children().eq(0);

	// 	expect(firstChild.hasClass('icons-spinner')).toBe(true);
	// });

	// it('It should remove the spinner if a promise is resolved', function() {
	// 	var deferred = $q.defer();
	// 	scope.spinner = deferred.promise;

	// 	scope.$digest();

	// 	var children = element.find('button').eq(0).children();
	// 	expect(children.length).toBe(1);

	// 	deferred.resolve();

	// 	scope.$digest();

	// 	children = element.find('button').eq(0).children();
	// 	expect(children.length).toBe(0);
	// });

	// it('It should disable the button while running', function() {
	// 	var button = element.find('button').eq(0);
	// 	scope.spinner = true;

	// 	scope.$digest();

	// 	expect(button.prop('disabled')).toBe(true);
	// });

	// it('It should reevaluate ng-disabled after finishing', function() {
	// 	var button = element.find('button').eq(0);
	// 	scope.disabled = true;

	// 	scope.spinner = true;

	// 	scope.$digest();

	// 	expect(button.prop('disabled')).toBe(true);

	// 	scope.spinner = false;

	// 	scope.$digest();

	// 	expect(button.prop('disabled')).toBe(true);
	// });

	// it('It should prepend only one spinner regardless how many times it is called', function() {
	// 	var button = element.find('button').eq(0);
	// 	scope.spinner = 'test_1';

	// 	scope.$digest();

	// 	scope.spinner = 'test_2';

	// 	scope.$digest();

	// 	var children = element.find('button').eq(0).children();
	// 	expect(children.length).toBe(1);
	// });
});
