(function() {
	'use strict';
	angular
		.module('jb.services')
		.factory('http', httpFactory);



	httpFactory.$inject = ['$http', '$httpParamSerializerJQLike', 'store'];
	/**
	 * factory
	 *
	 * @param  {angularJs} $http                      service
	 * @param  {angularJs} $httpParamSerializerJQLike service
	 * @param  {angularJs} store                      angular-storage
	 * @return {promise}
	 */
	function httpFactory($http, $httpParamSerializerJQLike, store) {
		return {
			get: get,
			post: post
		};


		///////////////////////////////


		/**
		 * $http.get wrapper
		 *
		 * @param  {string} url     GET url
		 * @param  {object} params  GET parameters
		 * @return {promise}
		 */
		function get(url, params) {
			return $http.get(
				url,
				{
					params: params,
					// paramSerializer: '$httpParamSerializerJQLike',
					// withCredentials:true
					// timeout: 5000,
					headers: {
						'Authorization': 'Bearer ' + store.get('token')
					}
				}
			);
		}
		/**
		 * $http.post wrapper
		 *
		 * @param  {string} url     POST url
		 * @param  {object} params  POST parameters
		 * @return {promise}
		 */
		function post(url, params) {
			return $http.post(
				url,
				$httpParamSerializerJQLike(params),
				{
					// params: params,
					// paramSerializer: '$httpParamSerializerJQLike',
					// withCredentials:true
					// timeout: 5000,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization': 'Bearer ' + store.get('token')
					}
				}
			);
		}
	}

})();


