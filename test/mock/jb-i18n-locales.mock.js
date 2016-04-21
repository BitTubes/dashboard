// https://gist.github.com/wilsonwc/8358542
angular.module('jb.i18n.locales.mock',[])
	.factory("i18nLocales", i18nLocales);


function i18nLocales($rootScope){
	/* jshint validthis:true */
	"use strict";
	var vm = this;
	// $rootScope.availableLocales = [
	// 	{code:"en", name: "English"},
	// 	{code:"de", name: "Deutsch"}
	// ];
	vm.allLocales = {
		"de": {
			"customer": ["Customer","Customers"],
			"default": "Foo",
			"inx": "in {0} {1}",
			"xago": "{0} {1} ago",
			"xony": "{0} on {1}",
		},
		"en": {
			"customer": ["Customer","Customers"],
			"default": "Foo",
			"inx": "in {0} {1}",
			"xago": "{0} {1} ago",
			"xony": "{0} on {1}",
		}
	};
	return vm.allLocales;
}

