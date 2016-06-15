(function() {
	'use strict';
	angular.module('bt.dashboard')
		.controller('AwsEditModalController', AwsEditModalController);


	AwsEditModalController.$inject = ['$scope', 'http', 'Auth', 'i18n', '$uibModalInstance'];
	function AwsEditModalController($scope, http, Auth, _, $uibModalInstance) {
		var vm = this;
		var defaultCustomer = {
			'ID': null,
			'name': _('default')
		};
		vm.CUSTOMERS = null;
		vm.customer = null;

		$scope.title = _('AWS Config');
		$scope.titlemode = $scope.ADD ? 'addx' : 'editx';


		$scope.s3BucketMax = 40;
		$scope.prefixMax = 60;
		$scope.cloudfrontMax = 60;
		$scope.awsKeyMax = 60;
		$scope.awsSecretMax = 60;
		$scope.awsRegionMax = 20;


		$scope.ok = ok;
		$scope.cancel = cancel;



		initView();


		/////////////////////


		function initView() {
			$scope.loadPromise = http.post($scope.uriApiCms + 'getCustomers', { 'api': $scope.DEFAULT_API })
			.then(function(response) {
				response.data.unshift(defaultCustomer);
				vm.CUSTOMERS = response.data;
				if(!$scope.ADD) {
					if($scope.config['customer_ID']) {
						for(var i = vm.CUSTOMERS.length - 1; i >= 0; i--) {
							if(vm.CUSTOMERS[i]['ID'] === $scope.config['customer_ID']) {
								vm.customer = vm.CUSTOMERS[i];
								break;
							}
						}
					} else {
						vm.customer = defaultCustomer;
					}
				}
				for(var c, k = vm.CUSTOMERS.length - 1; k >= 0; k--) {
					c = vm.CUSTOMERS[k];
					for(var j = $scope.CONFIGS.length - 1; j >= 0; j--) {
						if(c['ID'] === $scope.CONFIGS[j]['customer_ID']
							&& (vm.customer === null || vm.customer.ID !== c['ID'])) {
							c.used = true;
							break;
						}
					}
				}
			},
			Auth.checkHttpStatus.bind(Auth));
		}
		function cancel() {
			$uibModalInstance.dismiss('cancel');
		}
		function ok() {
			$scope.submitted = true;
			if($scope.editForm.$invalid) {
				// stop processing, error msgs will be displayed automatically
				return;
			}
			$scope.config['customer_ID'] = typeof vm.customer === 'undefined' ? null : vm.customer.ID;

			$uibModalInstance.close($scope);
		}
	}


})();
