(function() {
	'use strict';
	angular
		.module('jb.i18n.locales', [])
		.factory('i18nLocales', i18nLocales);



	// i18nLocales.$inject = ['$rootScope'];
	function i18nLocales(/*$rootScope*/) {
		/* jshint validthis:true */
		var vm = this;
		// $rootScope.availableLocales = [
		// 	{code:'en', name: 'English'},
		// 	{code:'de', name: 'Deutsch'}
		// ];
		vm.allLocales = {
			'de': {
				'1stLogin': 'Erste Anmeldung',
				'activatex': '{0} aktivieren',
				'adduserpassword': 'Der neue Benutzer wird eine E-Mail mit einer Anleitung erhalten, um das Passwort selbst zu setzen.',
				'addx': '{0} hinzufügen',
				'adminrestrictx': 'Du hast nicht genügend Rechte um einen BT-Admin zu {0}.',
				'adminx': 'Admin-Rechte {0}',
				'analyzer': 'Analyzer',
				'back': 'Zurück',
				'cancel': 'Abbrechen',
				'changelang': 'Sprache ändern',
				'comments': 'Kommentare',
				'copyx': '{0} kopieren',
				'created': 'Erstellt',
				'customer': ['Kunde', 'Kunden'],
				'days': 'Tage',
				'default': 'Standard',
				'defintion': 'Definition',
				'delete': 'Löschen',
				'deletex': '{0} löschen',
				'delme': 'Willst du deinen EIGENEN Account löschen?',
				'developer': 'Entwickler',
				'documentation': 'Dokumentation',
				'edit': 'Ändern',
				'editx': '{0} bearbeiten',
				'error': 'Fehler',
				'forgotpw': 'Password vergessen?',
				'form_err_email': '{0} muss eine E-Mail-Adresse sein',
				'form_err_lowercase': '{0} muss klein geschriebene Buchstaben enthalten',
				'form_err_max': '{0} ist zu lang (max. {1} Zeichen)',
				'form_err_min': '{0} ist zu kurz (mind. {1} Zeichen)',
				'form_err_number': '{0} muss Zahlen enthalten',
				'form_err_pattern': '{0} darf nur aus diesen Zeichen bestehen: {1}',
				'form_err_req': '{0} ist erforderlich',
				'form_err_uppercase': '{0} muss groß geschriebene Buchstaben enthalten',
				'fpw_err_reset': 'Reset fehlgeschlagen. Dein Update-Link ist veraltet - bitte starte erneut.',
				'fpw_err_send': 'Konnte E-Mail mit Anweisungen nicht versenden. Bitte prüfe deinen Login.',
				'fpw_err_token': 'Dein Update-Link ist veraltet - bitte starte erneut.',
				'fpw_help': 'Trage die für deinen Account verwendete E-Mail Adresse ein und wir senden dir eine Anleitung, wie du wieder darauf zugreifen kannst.',
				'fpw_reset_done': 'Passwort erfolgreich geändert',
				'fpw_sent_body': 'Anweisungen zum Zugriff auf deinen Account wurden an folgende Adresse versendet:',
				'fpw_sent_title': 'Anweisungen versendet!',
				'fromx': 'Von {0}',
				'generate': 'Generieren',
				'grant': 'gewähren',
				'granted': 'gewährt',
				'help': 'Hilfe',
				'hide': 'verstecken',
				'imprint': 'Impressum',
				'inx': 'in {0} {1}',
				'justnow': 'gerade eben',
				'lastcomment': 'Letzer Kommentar',
				'lastLogin': 'Letzte Anmeldung',
				'login': 'Anmelden',
				'logout': 'Abmelden',
				'message': 'Nachricht',
				'moderate': 'Moderieren',
				'moderation': 'Kommentare moderieren',
				'myprofile': 'Mein Profil',
				'name': 'Name',
				'never': 'nie',
				'noentries': 'Keine Einträge vorhanden',
				'note_adminx': 'Admin-Rechte für {0} {1}',
				'note_dberror': 'Datenbank-Update fehlgeschlagen',
				'note_loggedinas': 'Angemeldet als {0}',
				'note_loginfailed': 'Anmeldung fehlgeschlagen',
				'note_logout': 'Erfolgreich abgemeldet',
				'note_published0': '{0} ist jetzt geheim',
				'note_published1': '{0} ist jetzt öffentlich',
				'note_pwupdated': 'Passwort für {0} geändert',
				'note_statuschg': 'Status gespeichert',
				'monitoring': 'Überwachung',
				'note_xadded': '{0} hinzugefügt',
				'note_xdeleted': '{0} gelöscht',
				'note_xreactivated': '{0} reaktiviert',
				'note_xupdated': '{0} geändert',
				'openxiny': '{0} in {1} öffnen',
				'organisation': 'Organisation',
				'other': 'Weitere',
				'parameter': 'Parameter',
				'password': 'Passwort',
				'playlist': ['Playlist', 'Playlists'],
				'post_status-1': 'Versteckt (auto)',
				'post_status-2': 'Versteckt (manuell)',
				'post_status1': 'OK (auto)',
				'post_status2': 'OK (manuell)',
				'post_time': 'Post-Zeit',
				'publish': 'Öffentlich',
				'q_activate': 'Soll "{0}" aktiviert werden?',
				'q_delete': 'Soll "{0}" wirklich gelöscht werden?',
				'refreshx': '{0} erneuern',
				'reloginonsave': 'Hier änderst du deinen eigenen Account',
				'resetx': '{0} zurücksetzen',
				'revoke': 'entziehen',
				'revoked': 'entzogen',
				'search': 'Suche',
				'setx': '{0} setzen',
				'status': 'Status',
				'submit': 'Absenden',
				'switchedto': 'Zu {0} gewechselt',
				't_day': ['Tag', 'Tagen'],
				't_hour': ['Stunde', 'Stunden'],
				't_minute': ['Minute', 'Minuten'],
				't_month': ['Monat', 'Monaten'],
				't_second': ['Sekunde', 'Sekunden'],
				't_week': ['Woche', 'Wochen'],
				't_year': ['Jahr', 'Jahren'],
				'token': 'Token',
				'tox': 'Zu {0}',
				'type': 'Typ',
				'user': ['Benutzer', 'Benutzer'],
				'value': ['Wert', 'Werte'],
				'video': ['Video', 'Videos'],
				'video_time': 'Video-Zeit',
				'wait_addingx': '{0} wird hinzugefügt - bitte warten.',
				'wait_takex': 'Dies kann bis zu {0} {1} dauern.',
				'warning': 'Warnung',
				'xago': 'vor {0} {1}',
				'xepxiresy': '{0} wird ungültig {1}',
				'xfory': '{0} für {1}',
				'xony': '{0} zu {1}',
				'yourcurrentx': 'Dein aktueller {0}',
				'yourx': 'Dein {0}',
			}
		};

		return vm.allLocales;
	}

})();
