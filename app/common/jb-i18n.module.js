(function() {
	'use strict';
	angular
		.module('jb.i18n', ['angular-storage','jb.i18n.locales', 'jb.services'])
		.factory('i18n', i18nFactory)
		.filter('i18n',i18nFilter);



	///////////////////////
	///
	/// initial code to be run outside of Angular constrains for dynamic Loader to work
	///
	/// config here:
	var defaultLocale = 'en';
	var availableLocales = [
		{code:'en', name: 'English'},
		{code:'de', name: 'Deutsch'}
	];

	// stop editing here

	var _browserLocale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
	var _localesTest = {};
	for (var i = availableLocales.length - 1; i >= 0; i--) {
		_localesTest[availableLocales[i].code] = 1;
	}

	// load language files for angular and this app before angular executes (cannot use async loading!)
	_loadLocale();
	///
	/// initial code to be run outside of Angular constrains for dynamic Loader to work
	///
	///////////////////////




	i18nFilter.$inject = ['i18n'];
	/**
	 * offer language module as a filter
	 *
	 * @param  {object} _ the i18n service
	 * @return {string}   the translation
	 */
	function i18nFilter(_) {
		return function(str, number, replacements) {
			return _(str,number,replacements);
		};
	}
	i18nFactory.$inject = ['$rootScope', 'store', 'i18nLocales'];
	/**
	 * the translation service
	 *
	 * @param  {Object} $rootScope
	 * @param  {Object} store       angular-storage
	 * @param  {Object} i18nLocales tranlations module
	 * @return {string}             the translation
	 */
	function i18nFactory($rootScope, store, i18nLocales) {
		/* jshint validthis:true */
		var vm = this;
		$rootScope.availableLocales = availableLocales;

		$rootScope.locale = null;
		vm.loadedLocales = i18nLocales;
		vm.defaultLocale = defaultLocale;
		vm.translate = translate;
		vm.translate.changeLanguage = setLocaleWrap;

		// init and save to localStorage
		setLocaleWrap();



		return vm.translate;


		/**
		 * change Language
		 *
		 * @param {string} locale e.g. "en"
		 */
		function setLocaleWrap(locale) {
			if(_setLocale(locale, $rootScope, store)) {
				vm.locales = vm.loadedLocales[$rootScope.locale];
			}
		}

		/**
		 * the actual translation function
		 *
		 * @param  {string} key          identifier for i18nLocales
		 * @param  {integer|null|false} [number]       used to show the plural version
		 * @param  {string} replacements keys or plain strings
		 * @return {string}              the translation or key if no translation was found
		 */
		function translate(key, number, replacements) {
			var str = vm.locales[key];
			if(!str) {
				// string not found, return key itself
				return key;
			}
			if(typeof str !== 'string') {
				str = str[(number > 1 ? 1 : 0)];
			}
			if(!replacements) {
				return str;
			}
			if(typeof replacements === 'string' || !replacements) {
				replacements = [replacements];
			}
			for (var i = 0; i < replacements.length; i++) {

				if(!!vm.locales[replacements[i]]) {
					replacements[i] = translate(replacements[i]);
				}
				var regexp = new RegExp('\\{' + i + '\\}', 'gi');
				str = str.replace(regexp, replacements[i]);
			}
			return str;
		}
	}


	///////////////////////


	/**
	 * loads the module that provides the actual translation onLoad of document
	 * document.write is used here to prevent "module unknown" angular-errors
	 *
	 * no @return
	 */
	function _loadLocale() {
		var temp = {locale: null};
		_setLocale('',temp);
		var locale = temp.locale;

		var scripts = ['angular-locale_','jb-i18n_'];
		var src;
		for (var i = scripts.length - 1; i >= 0; i--) {
			src = 'locales/' + scripts[i] + locale + '.js';
			document.write('<script src="' + src + '"><\/script>');
		}
	}

	/**
	 * wrapper for localStorage.getItem, immitating angular-storage behavior
	 * used for initially setting/getting the system's language before angular modules are available
	 *
	 * @param  {string} key e.g. "en"
	 * @return {string|Object|integer|boolean}     whatever was stored via localStorage
	 */
	function _storeLocalGet(key) {
		return JSON.parse(localStorage.getItem(key));
	}
	/**
	 * wrapper for localStorage.getItem, immitating angular-storage behavior
	 * used for initially setting/getting the system's language before angular modules are available
	 *
	 * @param {string} locale     [description]
	 * @param {Object} $rootScope [description]
	 * @param {Object} [store]      reference to angular-store service
	 * @return {boolean} true if language was set for the first time, undefined in any other case
	 */
	function _setLocale(locale, $rootScope, store) {
		if($rootScope.locale === locale) {
			return;
		}
		var newLocale;
		var storedLocale = store ? store.get('locale') : _storeLocalGet('locale');

		// try language passed to function
		if(_localesTest[locale]) {
			newLocale = locale;
		} else if(locale && locale.length > 2 && _localesTest[locale.substring(0,2)]) {
			newLocale = locale.substring(0,2);
		// try last used language
		} else if(storedLocale && _localesTest[storedLocale]) {
			newLocale = storedLocale;
		// try browser language
		} else if(_localesTest[_browserLocale]) {
			newLocale = _browserLocale;
		} else if(_browserLocale.length > 2 && _localesTest[_browserLocale.substring(0,2)]) {
			newLocale = _browserLocale.substring(0,2);
		// fall back to default
		} else {
			newLocale = defaultLocale;
		}
		if(newLocale !== $rootScope.locale) {
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

})();
