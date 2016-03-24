(function() {
	"use strict";
	angular
		.module('jbServices')
		// .factory('i18n', i18nFactory)
		.filter('i18n',i18nFilter)
		.provider('i18n', I18nProvider);


	I18nProvider.$inject = ['$injector'];
	function I18nProvider($injector) {
		 var store = $injector.get('store');

		// var useTinfoilShielding = false;
		var pv = this;
		pv.availableLocales = [
			{code:'en', name: 'English'},
			{code:'de', name: 'Deutsch'}
		];
		pv.allLocales = {};
		pv.defaultLocale = 'en';
		pv.locale = null;

		pv.setLocale = setLocale;

		var browserLocale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);



		function setLocale(locale) {
			// console.log("setLocale",locale);
			if(pv.locale === locale) {
				return;
			}
			var newLocale;
			var storedLocale;
			// var storedLocale = store.get('locale');

			// try language passed to function
			if(pv.allLocales[locale]) {
				newLocale = locale;
			} else if(locale && locale.length > 2 && pv.allLocales[locale.substring(0,2)]) {
				newLocale = locale.substring(0,2);
			// try last used language
			} else if(storedLocale && pv.allLocales[storedLocale]) {
				newLocale = storedLocale;
			// try browser language
			} else if(pv.allLocales[browserLocale]) {
				newLocale = browserLocale;
			} else if(browserLocale.length > 2 && pv.allLocales[browserLocale.substring(0,2)]) {
				newLocale = browserLocale.substring(0,2);
			// fall back to default
			} else {
				newLocale = pv.defaultLocale;
			}
			if(newLocale != pv.locale) {
				// console.log("new language",newLocale);

				// store in localStorage
				// store.set('locale', newLocale);

				// we are changing the current language - need to refresh the entire website
				if(pv.locale !== null) {
					location.reload();
				}
				// assume initial load if we get here
				pv.locale = newLocale;
				pv.locales = pv.allLocales[pv.locale];

			}
		}

		pv.$get = ['$rootScope', 'i18nLocales', function i18nFactory($rootScope, i18nLocales){//(locale, availableLocales) {
			/* jshint validthis:true */
			var vm = this;
			pv.allLocales = i18nLocales;
			// function setDefault() {}

			$rootScope.availableLocales = pv.availableLocales;

			// (function init(locale) {
			// if(!locale) {
			// var browserLocale = navigator.language || navigator.userLanguage;
			// }

			var translate = function (key, number, replacements) {
				console.log("pv-temp", pv.temp);
				var str = pv.locales[key];
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
					// console.info("replacements", replacements[i], pv.locales[replacements[i]], !!pv.locales[replacements[i]]);

					if(!!pv.locales[replacements[i]]) {
						replacements[i] = translate(replacements[i]);
						// console.info("replaced to:", replacements[i]);
					}
					var regexp = new RegExp('\\{'+i+'\\}', 'gi');
					str = str.replace(regexp, replacements[i]);
				}
				return str;
			};
			translate.prototype.changeLanguage = pv.setLocale;
			pv.setLocale();
			return translate;
		}];
		// this.$get = function unicornLauncherFactory(apiToken) {

		// 	// let's assume that the UnicornLauncher constructor was also changed to
		// 	// accept and use the useTinfoilShielding argument
		// 	return new UnicornLauncher(apiToken, useTinfoilShielding);
		// };
	}






	i18nFilter.$inject = ['i18n'];
	function i18nFilter(_){
		return function(str, number, replacements){
			return _(str,number,replacements);
		};
	}
	// i18nFactory.$inject = ['$rootScope', 'store', 'i18nLocales'];
	



})();