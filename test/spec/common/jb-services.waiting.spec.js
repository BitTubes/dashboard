describe('Factory: jb.services.waiting', function() {
	"use strict";

	beforeEach(module('jb.services'));
	beforeEach(module('ui.bootstrap'));


	var myFactory;
	var $rootScope;
	var $uibModal;


	beforeEach(inject(function($injector, _$rootScope_, _$uibModal_){
		$rootScope = _$rootScope_;
		$uibModal = _$uibModal_;
		myFactory = $injector.get("waiting");

		// fake modal-open funciton
		spyOn($uibModal, 'open').and.returnValue({close:function(){}});
		// open the (fake) modal
		myFactory.show("a","b");
	}));

	it('should call $uibModal.open', function() {

		expect($uibModal.open).toHaveBeenCalled();

	});
	it('should call modalInstance.close', function() {
		// get the (fake) modal reference
		var modalInstance = myFactory._test.modalInstance;
		// and create a mock version of it's close-function
		spyOn(modalInstance, 'close').and.returnValue(true);

		// hide the (fake) modal
		myFactory.hide();

		expect(modalInstance.close).toHaveBeenCalled();
	});
});
