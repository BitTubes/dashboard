describe('Factory: jb.services.seconds2time', function() {
	"use strict";

	beforeEach(module('jb.services'));


	var $filter;
	var $rootScope;
	var myFilter;


	beforeEach(inject(function(_$filter_, _$rootScope_){
		$rootScope = _$rootScope_;
		$filter = _$filter_;
		myFilter = _$filter_('seconds2time');
	}));

	it('expect 5 seconds to return "0:05"', function() {
		expect(myFilter(5)).toBe("0:05");
	});
	it('expect 61 seconds to return "1:01"', function() {
		expect(myFilter(61)).toBe("1:01");
	});
	it('expect 3601 seconds to return "01:00:01"', function() {
		expect(myFilter(3601)).toBe("01:00:01");
	});
	it('expect 3691 seconds to return "01:01:31"', function() {
		expect(myFilter(3691)).toBe("01:01:31");
	});
	it('expect 3791 seconds to return "01:03:11"', function() {
		expect(myFilter(3791)).toBe("01:03:11");
	});
});
