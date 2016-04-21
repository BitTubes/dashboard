describe('Factory/Filter: jb.services.elapsed', function() {
	"use strict";

	beforeEach(module('jb.services'));
	beforeEach(module('jb.i18n.locales.mock'));


	var myFactory;
	var $rootScope;
	// var myFilter;
	var $filter;


	beforeEach(inject(function(_$filter_, _$rootScope_, $injector){
		$rootScope = _$rootScope_;
		$filter = _$filter_;
		myFactory = $injector.get("elapsed");

		jasmine.clock().install();
		jasmine.clock().mockDate(new Date(Date.UTC(2016, 3, 21,0,0,0,0))); // month begins with 0!!!
		// 2016-04-21 00:00:00
	}));
	afterEach(function() {
		jasmine.clock().uninstall();
	});
	// it('filter should call factory', function() {
	// 	myFilter = $filter('elapsed');
	// 	spyOn(myFactory);

	// 	myFilter('2014-01-01 01:01:01');
	// 	expect(myFactory).toHaveBeenCalled();
	// });

	it('not defined dates should return the replacement string', function() {
		expect(myFactory(null)).toBe('never');
		expect(myFactory(0)).toBe('never');
		expect(myFactory(undefined)).toBe('never');
		expect(myFactory(false)).toBe('never');

		expect(myFactory(0,'custom')).toBe('custom');
	});
	it('expected in 59 min', function() {
		expect(myFactory('2016-04-21 00:59:00')).toBe('in 59 t_minute');
	});
	it('expect FUTURE seconds to be shown accurately', function() {
		expect(myFactory('2016-04-21 00:00:59')).toBe('in 59 t_second');
	});
	it('expect PAST seconds to be abbreviated', function() {
		expect(myFactory('2016-04-20 23:59:01')).toBe('justnow');
	});
	it('expected 5 min ago', function() {
		expect(myFactory('2016-04-20 23:54:59')).toBe('5 t_minute ago');
	});
	it('expected 1h ago', function() {
		expect(myFactory('2016-04-20 22:59:59')).toBe('1 t_hour ago');
	});
	it('expected 1 day ago', function() {
		expect(myFactory('2016-04-20 00:00:00')).toBe('1 t_day ago');
	});
	it('expected 1 week ago', function() {
		expect(myFactory('2016-04-14 00:00:00')).toBe('1 t_week ago');
	});
	it('expected 2 week ago', function() {
		expect(myFactory('2016-04-06 00:00:00')).toBe('2 t_week ago');
	});
	it('expected 1 month ago', function() {
		expect(myFactory('2016-03-14 00:00:00')).toBe('1 t_month ago');
	});
	it('expected 1 year ago', function() {
		expect(myFactory('2015-01-20 00:00:00')).toBe('1 t_year ago');
	});
});
