(function() {
	"use strict";
	angular
		.module('jb.i18n', ['angular-storage','jb.i18n.locales', 'jb.services'])
		.factory('i18n', i18nFactory)
		.filter('i18n',i18nFilter);



	///////////////////////
	///
	/// initial code to be run outside of Angular constrains for dynamic Loader to work
	///
	var browserLocale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
	var defaultLocale = 'en';
	var availableLocales = [
		{code:"en", name: "English"},
		{code:"de", name: "Deutsch"}
	];
	var localesTest = {};
	for (var i = availableLocales.length - 1; i >= 0; i--) {
		localesTest[availableLocales[i].code] = 1;
	}
	function storeLocalGet(key) {
		return JSON.parse(localStorage.getItem(key));
	}
	function setLocale(locale, $rootScope, store) {
		if($rootScope.locale === locale) {
			return;
		}
		var newLocale;
		var storedLocale = store ? store.get('locale') : storeLocalGet('locale');

		// try language passed to function
		if(localesTest[locale]) {
			newLocale = locale;
		} else if(locale && locale.length > 2 && localesTest[locale.substring(0,2)]) {
			newLocale = locale.substring(0,2);
		// try last used language
		} else if(storedLocale && localesTest[storedLocale]) {
			newLocale = storedLocale;
		// try browser language
		} else if(localesTest[browserLocale]) {
			newLocale = browserLocale;
		} else if(browserLocale.length > 2 && localesTest[browserLocale.substring(0,2)]) {
			newLocale = browserLocale.substring(0,2);
		// fall back to default
		} else {
			newLocale = defaultLocale;
		}
		if(newLocale != $rootScope.locale) {
			// console.log("new language",newLocale);

			// store in localStorage
			if(store) {
				store.set('locale', newLocale);
			}

			// we are changing the current language - need to refresh the entire website
			if($rootScope.locale !== null) {
				location.reload();
			} else {
				// assume initial load if we get here
				$rootScope.locale = newLocale;
				return true;
			}

		}
	}
	function loadLocale() {
		var temp = {locale: null};
		setLocale('',temp);
		var locale = temp.locale;
		// var locale = JSON.parse(localStorage.getItem('locale'));
		// if(!locale) {
		// 	locale = browserLocale.substring(0,2);
		// 	if(!localesTest[locale]) {
		// 		locale = defaultLocale;
		// 	}
		// }
		var scripts = ['angular-locale_','jb-i18n_'];
		var src;
		// var head = document.getElementsByTagName("body")[0];
		for (var i = scripts.length - 1; i >= 0; i--) {
			src = 'locales/'+scripts[i]+locale+'.js';
			// var script=document.createElement('script');
			// script.setAttribute("type","text/javascript");
			// script.setAttribute("src", src);
			// head.appendChild(script);
			document.write('<script src="'+src+'"><\/script>');
		}
	}
	loadLocale();
	///
	/// initial code to be run outside of Angular constrains for dynamic Loader to work
	///
	///////////////////////




	i18nFilter.$inject = ['i18n'];
	function i18nFilter(_){
		return function(str, number, replacements){
			return _(str,number,replacements);
		};
	}
	i18nFactory.$inject = ['$rootScope', 'store', 'i18nLocales'];
	function i18nFactory($rootScope, store, i18nLocales){//(locale, availableLocales) {
		/* jshint validthis:true */
		var vm = this;
		$rootScope.availableLocales = availableLocales;

		$rootScope.locale = null;
		vm.loadedLocales = i18nLocales;
		vm.defaultLocale = defaultLocale;
		vm.translate = translate;
		vm.translate.changeLanguage = setLocaleWrap;

		setLocaleWrap(); // init and save to localStorage



		return vm.translate;



		function setLocaleWrap(locale) {
			if(setLocale(locale, $rootScope, store)) {
				// console.warn("loadedLocales", vm.loadedLocales, $rootScope.locale);
				vm.locales = vm.loadedLocales[$rootScope.locale];
			}
		}

		function translate(key, number, replacements) {
			var str = vm.locales[key];
			if(!str) {
				// console.log("string not found, returning key");
				return key;
			}
			if(typeof str !== "string") {
				str = str[(number>1?1:0)];
			}
			if(!replacements) {
				return str;
			}
			if(typeof replacements == "string" || !replacements) {
				replacements = [replacements];
			}
			for (var i = 0; i < replacements.length; i++) {

				if(!!vm.locales[replacements[i]]) {
					replacements[i] = translate(replacements[i]);
				}
				var regexp = new RegExp('\\{'+i+'\\}', 'gi');
				str = str.replace(regexp, replacements[i]);
			}
			return str;
		}
	}


})();
