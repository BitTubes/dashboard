angular.module('app', [])
.factory('add1', [function(){
	return function name(value){
		return value + 1;

	};
}]);

/////////////////////////////////////////
/////////////////////////////////////////

describe('length filter', function() {
	beforeEach(module('app'));

	var add1Factory;

	beforeEach(inject(function($injector){
		add1Factory = $injector.get("add1");
	}));

	it('returns 0 when given -1', function() {
		expect(add1Factory(-1)).toEqual(0);
	});

	it('returns "test1" when given "test"', function() {
		expect(add1Factory("test")).toEqual("test1");
	});
});
