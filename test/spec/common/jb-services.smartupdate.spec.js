describe('Factory: jb.services.smartUpdate', function() {
	'use strict';

	beforeEach(module('jb.services'));


	var myFactory;
	var $rootScope;
	var testObj;
	var testArray;


	beforeEach(inject(function($injector, _$rootScope_) {
		$rootScope = _$rootScope_;
		myFactory = $injector.get('smartUpdate');

		testObj = {
			'fieldA': 'a',
			'fieldB': 'b',
			'fieldC': 'c'
		};
		testArray = ['fieldA', 'fieldC'];
		myFactory.setFields(testArray);
	}));

	it('should update internal fields array', function() {
		expect(myFactory._test.fields).toBe(testArray);
	});

	it('should not create backup fields', function() {
		testArray = null;
		myFactory.setFields(testArray);

		expect(myFactory.makeBackup(testObj)).toEqual(false);
	});

	it('should create backup fields, including the non-existing field', function() {
		spyOn(console, 'error');
		testArray = ['fieldA', 'fieldC', 'nonExistingField'];
		myFactory.setFields(testArray);
		myFactory.makeBackup(testObj);

		// expect(console.error).toHaveBeenCalled();

		expect(testObj.nonExistingField).toEqual(undefined);
	});

	it('should have created backup fields', function() {
		myFactory.makeBackup(testObj);

		expect(testObj.fieldABak).toEqual(testObj.fieldA);
		expect(testObj.fieldBBak).toEqual(undefined);
		expect(testObj.fieldCBak).toEqual(testObj.fieldC);
	});

	it('expect NO changes to be recognized', function() {
		myFactory.makeBackup(testObj);

		testObj.fieldB = 'bb';

		expect(myFactory.wasChanged(testObj)).toBe(false);
	});

	it('expect changes to be recognized', function() {
		myFactory.makeBackup(testObj);

		testObj.fieldC = 'cc';

		expect(myFactory.wasChanged(testObj)).toBe(true);
	});

	it('expect changes to be recognized', function() {
		myFactory.makeBackup(testObj);

		testObj.fieldC = 'cc';

		expect(myFactory.wasChangedNotEmpty(testObj)).toBe(true);
	});

	it('expect NO changes to be recognized because the field was set to an empty string', function() {
		myFactory.makeBackup(testObj);

		testObj.fieldC = '';

		expect(myFactory.wasChangedNotEmpty(testObj)).toBe(false);
	});
});
