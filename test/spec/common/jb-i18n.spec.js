describe('Module: jb.i18n', function() {
	"use strict";
	beforeEach(module('jb.i18n'));
	beforeEach(module('jb.i18n.locales.mock'));

	var $filter;
	var i18nFactory;
	var $rootScope;
	var store;

	beforeEach(inject(function(_$filter_, _$rootScope_, _store_, $injector){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$filter = _$filter_;
		$rootScope = _$rootScope_;
		store = _store_;
		i18nFactory = $injector.get("i18n");
	}));


	describe('i18nFilter / translate()', function() {
		var i18n;

		beforeEach(function() {
			i18n = $filter('i18n');
		});

		describe('print "Customer" from an object containing an array', function() {
			it('with number not set', function() {
				expect(i18n('customer')).toEqual("Customer");
			});
			it('with number set to 1', function() {
				expect(i18n('customer',1)).toEqual("Customer");
			});
			it('with number not set to -1', function() {
				expect(i18n('customer',-1)).toEqual("Customer");
			});
			it('with number not set to "string"', function() {
				expect(i18n('customer','string')).toEqual("Customer");
			});
		});

		it('print "Customers" from an object containing an array', function() {
			expect(i18n('customer',2)).toEqual("Customers");
		});
		describe('print "Foo" from an object containing a string', function() {
			it('with number not set', function() {
				expect(i18n('default')).toEqual("Foo");
			});
			it('with number set to 1', function() {
				expect(i18n('default',1)).toEqual("Foo");
			});
			it('with number set to 2', function() {
				expect(i18n('default',2)).toEqual("Foo");
			});
		});
		it('print "not-set" by providing a key that is not available in the locales', function() {
			expect(i18n('not-set')).toEqual("not-set");
		});
		describe('test string replacements', function() {
			it('parameters not set', function() {
				expect(i18n('xony')).toEqual("{0} on {1}");
			});
			it('empty array given ', function() {
				expect(i18n('xony',null,[])).toEqual("{0} on {1}");
			});
			it('string given that is not a key itself', function() {
				expect(i18n('xony',null,'test')).toEqual("test on {1}");
			});
			it('string given that is a key itself', function() {
				expect(i18n('xony',null,'default')).toEqual("Foo on {1}");
			});
			it('array given that contains 1 key', function() {
				expect(i18n('xony',null,['default'])).toEqual("Foo on {1}");
			});
			it('array given that contains 1 key and 1 string', function() {
				expect(i18n('xony',null,['default','bar'])).toEqual("Foo on bar");
			});
			it('array given that contains 2 keys', function() {
				expect(i18n('xony',null,['default','xony'])).toEqual("Foo on {0} on {1}");
			});
			it('array given that contains 2 keys with one resolving to an array', function() {
				expect(i18n('xony',null,['default','customer'])).toEqual("Foo on Customer");
			});
		});
		// it('print "default"', function() {
		// 	expect(i18n('default',2)).toEqual("Customers");
		// });

	});
	describe('changeLanguage()', function() {

		var i18n;
		beforeEach(function() {
			i18n = i18nFactory;
			$rootScope.locale = null; // else changing language will trigger a reload
		});

		describe('_setLocale()', function() {
			it('change to "de"', function() {
				i18n.changeLanguage("de");
				expect($rootScope.locale).toEqual("de");
			});
			it('change to "de-de" which should fallback to "de"', function() {
				i18n.changeLanguage("de-de");
				expect($rootScope.locale).toEqual("de");
			});
			it('change to "fake" which should fallback to stored value "de"', function() {
				store.set('locale', 'de');
				i18n.changeLanguage("fake");
				expect($rootScope.locale).toEqual('de');
			});
			it('change to "fake" which should fallback to stored value "en"', function() {
				store.set('locale', 'en');
				i18n.changeLanguage("fake");
				expect($rootScope.locale).toEqual('en');
			});
			it('change to "fake" which should fallback to default "en"', function() {
				store.remove('locale');
				i18n.changeLanguage("fake");
				// remove any language from storage to ease this test
				// get the current browser's language setting
				var _browserLocale = navigator.languages ? navigator.languages[0]
					: (navigator.language || navigator.userLanguage);
				var _localesTest = {};
				for (var i = $rootScope.availableLocales.length - 1; i >= 0; i--) {
					_localesTest[$rootScope.availableLocales[i].code] = 1;
				}
				// depending on the host system, the browser might output a language thats in the list of available locales (de/en)
				// if not, "en" will be chosen as that's the default language set in the module
				var expectedValue = _localesTest[_browserLocale] ? _browserLocale
					: _localesTest[_browserLocale.substring(0,2)] ? _browserLocale.substring(0,2)
					: "en";
				expect($rootScope.locale).toEqual(expectedValue);
			});
		});



	});

});
