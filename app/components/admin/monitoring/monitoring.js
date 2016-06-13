(function() {
	'use strict';
	angular.module('bt.dashboard')
		.controller('MonitoringController', MonitoringController);


	MonitoringController.$inject = ['http', '$scope', '$rootScope', 'Auth', '$locale'];
	function MonitoringController(http, $scope, $rootScope, Auth, $locale) {
		var vm = this;
		vm.days = 1;
		vm.drawChart = drawChart;
		vm.myChartObject = {};
		vm.PINGS = null;
		// keep the following in scope to ease copy-paste of the sorting
		$scope.loadPromise = null;
		$scope.reload = initView;
		$scope.orderByField = 'name';
		$scope.reverseSort = false;


		initView();


		/////////////////////


		function drawChart(data) {
			vm.myChartObject.type = 'LineChart';
			vm.myChartObject.data = {
				'cols': [
					{id: 'gsDateTime', label: 'Time of Day', type: 'datetime'},
					{id: 'gsMaxResp', label: 'Max. Response Time', type: 'number'},
					{id: 'gsMaxResp', label: 'Avg. Response Time', type: 'number'},
					{id: 'gsMaxResp', label: 'Min. Response Time', type: 'number'},
					{id: 'gsVal', label: 'Error Rate', type: 'number'}
				],
				'rows': []
			};

			angular.forEach(data, function(value) {
				vm.myChartObject.data.rows.push(
					{c: [
						{v: new Date(value['ts'] * 1000)},
						{v: value['response']['max']},
						{v: value['response']['avg']},
						{v: value['response']['min']},
						{v: value['error_rate']}
					]}
				);
			});

			vm.myChartObject.formatters = {
				number: [
					{
						columnNum: 1,
						pattern: '#' + $locale.NUMBER_FORMATS.DECIMAL_SEP + '###' + $locale.NUMBER_FORMATS.GROUP_SEP + '### ms'
					},
					{
						columnNum: 2,
						pattern: '#' + $locale.NUMBER_FORMATS.DECIMAL_SEP + '###' + $locale.NUMBER_FORMATS.GROUP_SEP + '### ms'
					},
					{
						columnNum: 3,
						pattern: '#' + $locale.NUMBER_FORMATS.DECIMAL_SEP + '###' + $locale.NUMBER_FORMATS.GROUP_SEP + '### ms'
					},
					{
						columnNum: 4,
						pattern: '#' + $locale.NUMBER_FORMATS.DECIMAL_SEP + '###' + $locale.NUMBER_FORMATS.GROUP_SEP + '## %'
					}]

			};

			vm.myChartObject.options = {
				pointSize: 5,
				title: 'HTTP-CDN Monitoring last ' + vm.days + ' days',
				focusTarget: 'category',
				colors: [
					'#ff9900', //orange
					'#3366cc', // blue
					'#109618', // green
					'#dc3912' // red
				],
				legend: { position: 'top' },
				vAxes: {
					0: {title: 'Response Time (ms)', minValue: 0, format: '#' + $locale.NUMBER_FORMATS.DECIMAL_SEP + '### ms' },
					1: {title: 'Error Rate (errors/call)', minValue: 0, maxValue: 0.05, format: '#' + $locale.NUMBER_FORMATS.DECIMAL_SEP + '###' + $locale.NUMBER_FORMATS.GROUP_SEP + '## %'}
				},
				series: {
					0: { targetAxisIndex: 0 },
					1: { targetAxisIndex: 0 },
					2: { targetAxisIndex: 0 },
					3: { targetAxisIndex: 1 }
				}
			};
		}


		/////////////////////


		function initView() {
			$scope.loadPromise = http.post($rootScope.uriApiAnalyzer + 'getMonitoring', { 'api': $rootScope.API, 'p': {'days': vm.days} })
			.then(function(response) {
				vm.PINGS = response.data;
				vm.drawChart(vm.PINGS);
			},
			Auth.checkHttpStatus.bind(Auth));
		}

	}


})();
