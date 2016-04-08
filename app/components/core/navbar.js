(function() {
	"use strict";
	angular
		.module('bt.dashboard')
		.directive("btNavbar", navbarDirective)
		.controller("navbarController", navbarController);


	navbarController.$inject = ['$rootScope', '$state', 'AUTH', 'i18n', 'store', 'notification'];
	function navbarController($rootScope, $state, Auth, _, store, note) {
		/* jshint validthis:true */
		var vm = this;

		vm.changeAccount = $rootScope.changeAccount = changeAccount; // yes, make that global
		vm.changeLang = changeLang;
		vm.logout = logout;
		vm.navCollapsed = true;
		vm.tabs = $rootScope.tabs.app;
		vm.tabsAdmin = $rootScope.tabs.admin;

		vm.imageS = 'img/Icon_Final_48.png';
		vm.imageL = 'img/Logo_Bittubes_245x40.png';


		function changeAccount(newAccount) {
			// make sure the nav is collapsed (req. for smaller screens)
			vm.navCollapsed = true;

			// notifiy the user of the change
			note.info(_('switchedto',null, newAccount['name']));

			// update UI
			$rootScope.ACCOUNT = newAccount;
			store.set('account', newAccount);
			$rootScope.API = newAccount['api'];
			$state.reload();
		}
		function changeLang(code) {
			_.changeLanguage(code);
		}
		function logout() {
			Auth.logout();
		}

	}

	function navbarDirective() {
		return {
			restrict: "E",
			templateUrl: "components/core/navbar.html",
			controller: 'navbarController',
			controllerAs: 'cms'
		};
	}
})();