describe('Module: jb.password', function() {
	"use strict";
	beforeEach(module('jb.password'));

	var $compile;
	var $rootScope;
	var element;
	var form;
	var directive;
	var testString;

	// Store references to $rootScope and $compile
	// so they are available to all tests in this describe block
	beforeEach(inject(function(_$compile_, _$rootScope_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.testModel = "";
	}));

	// describe('Directive: jbBlacklist', function() {
	// 	var filter;

	// 	beforeEach(function(){
	// 		directive = 'jb-blacklist';

	// 		testString = "black";
	// 		filter = "white";
	// 	});

	// 	it('test if a word other than the blacklisted one is passed as valid', function() {
	// 		// Compile a piece of HTML containing the directive
	// 		element = angular.element('<input ng-model="testModel" '+directive+'="'+filter+'">');
	// 		$compile(element)($rootScope);
	// 		// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
	// 		$rootScope.$digest();

	// 		element.val(testString).triggerHandler("input");
	// 		$rootScope.apply();


	// 		expect(element).toBe(false);
	// 		expect(element.hasClass('ng-valid')).toBe(true);
	// 	});
	// });

	describe('Directive: jbBlacklist', function() {
		beforeEach(function(){
			directive = 'jb-blacklist="111,black"';

			// Compile a piece of HTML containing the directive
			element = angular.element('<ng-form name="testForm"><input name="testInput" ng-model="testModel" '+directive+'></ng-form>');
			$compile(element)($rootScope);
			// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
			$rootScope.$digest();

			element = element.find('input');
			form = $rootScope.testForm;
		});

		describe('view-to-model', function() {
			it('string that is not on the blacklist will return VALID', function() {
				testString = "pass";

				angular.element(element).val(testString).triggerHandler("input");
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('string containing a blacklisted word will return INVALID', function() {
				testString = "black3";

				angular.element(element).val(testString).triggerHandler("input");
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
		});
		describe('model-to-view', function() {
			it('string that is not on the blacklist will return VALID', function() {
				testString = "pass";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('string containing a blacklisted word will return INVALID', function() {
				testString = "black3";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('integer thats on the blacklist will return INVALID', function() {
				testString = 111;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('null will return VALID', function() {
				testString = null;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('undefined will return VALID', function() {
				testString = undefined;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('empty string will return VALID', function() {
				testString = "";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
		});
	});
	describe('Directive: jbNumber', function() {

		beforeEach(function(){
			directive = 'jb-number';

			// Compile a piece of HTML containing the directive
			element = angular.element('<ng-form name="testForm"><input name="testInput" ng-model="testModel" '+directive+'></ng-form>');
			$compile(element)($rootScope);
			// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
			$rootScope.$digest();

			element = element.find('input');
			form = $rootScope.testForm;
		});

		describe('view-to-model', function() {
			it('string containing a number will return VALID', function() {
				testString = "black1white";

				angular.element(element).val(testString).triggerHandler("input");
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('string containing no number will return INVALID', function() {
				testString = "blackwhite";

				angular.element(element).val(testString).triggerHandler("input");
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
		});
		describe('model-to-view', function() {
			it('integer will return VALID', function() {
				testString = 111;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('string containing a number will return VALID', function() {
				testString = "black1white";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('string containing no number will return INVALID', function() {
				testString = "blackwhite";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('null will return INVALID', function() {
				testString = null;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('undefined will return INVALID', function() {
				testString = undefined;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('empty string will return INVALID', function() {
				testString = "";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
		});
	});
	describe('Directive: jbLowercase', function() {

		beforeEach(function(){
			directive = 'jb-lowercase';

			// Compile a piece of HTML containing the directive
			element = angular.element('<ng-form name="testForm"><input name="testInput" ng-model="testModel" '+directive+'></ng-form>');
			$compile(element)($rootScope);
			// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
			$rootScope.$digest();

			element = element.find('input');
			form = $rootScope.testForm;
		});

		describe('view-to-model', function() {
			it('string containing lowercase letters will return VALID', function() {
				testString = "black1white";

				angular.element(element).val(testString).triggerHandler("input");
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('string containing no lowercase letters will return INVALID', function() {
				testString = "TEST";

				angular.element(element).val(testString).triggerHandler("input");
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
		});
		describe('model-to-view', function() {
			it('integer will return INVALID', function() {
				testString = 111;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('string containing lowercase letters will return VALID', function() {
				testString = "black1white";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('string containing no lowercase letters will return INVALID', function() {
				testString = "TEST";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('null will return INVALID', function() {
				testString = null;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('undefined will return INVALID', function() {
				testString = undefined;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('empty string will return INVALID', function() {
				testString = "";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
		});
	});
	describe('Directive: jbUppercase', function() {

		beforeEach(function(){
			directive = 'jb-uppercase';

			// Compile a piece of HTML containing the directive
			element = angular.element('<ng-form name="testForm"><input name="testInput" ng-model="testModel" '+directive+'></ng-form>');
			$compile(element)($rootScope);
			// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
			$rootScope.$digest();

			element = element.find('input');
			form = $rootScope.testForm;
		});

		describe('view-to-model', function() {
			it('string containing lowercase letters will return INVALID', function() {
				testString = "black1white";

				angular.element(element).val(testString).triggerHandler("input");
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('string containing uppercase letters will return VALID', function() {
				testString = "TEST1";

				angular.element(element).val(testString).triggerHandler("input");
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
		});
		describe('model-to-view', function() {
			it('integer will return INVALID', function() {
				testString = 111;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('string containing lowercase letters will return INVALID', function() {
				testString = "black1white";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('string containing uppercase letters will return VALID', function() {
				testString = "TEST1";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$valid).toBe(true);
			});
			it('null will return INVALID', function() {
				testString = null;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('undefined will return INVALID', function() {
				testString = undefined;

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
			it('empty string will return INVALID', function() {
				testString = "";

				$rootScope.testModel = testString;
				$rootScope.$apply();

				expect(form.testInput.$invalid).toBe(true);
			});
		});
	});
});
