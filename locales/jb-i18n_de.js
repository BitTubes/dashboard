(function() {
	"use strict";
	angular
		.module('jb.i18n.locales', [])
		.factory("i18nLocales", i18nLocales);



	i18nLocales.$inject = ["$rootScope"];
	function i18nLocales($rootScope){
		/* jshint validthis:true */
		var vm = this;
		// $rootScope.availableLocales = [
		// 	{code:"en", name: "English"},
		// 	{code:"de", name: "Deutsch"}
		// ];
		vm.allLocales = {
			"de": {
				"1stLogin": "Erste Anmeldung",
				"activatex": "{0} aktivieren",
				"addx": "{0} hinzufügen",
				"analyzer" : "Analyzer",
				"back": "Zurück",
				"cancel": "Abbrechen",
				"comments": "Kommentare",
				"copyx": "{0} kopieren",
				"created": "Erstellt",
				"customer": ["Kunde","Kunden"],
				"default": "Standard",
				"delete": "Löschen",
				"deletex": "{0} löschen",
				"delme": "Willst du deinen EIGENEN Account löschen?",
				"developer": "Entwickler",
				"edit": "Ändern",
				"editx": "{0} bearbeiten",
				"error": "Fehler",
				"form_err_email": "{0} muss eine E-Mail-Adresse sein",
				"form_err_max": "{0} ist zu lang (max. {1} Zeichen)",
				"form_err_min": "{0} ist zu kurz (mind. {1} Zeichen)",
				"form_err_pattern": "{0} darf nur aus diesen Zeichen bestehen: {1}",
				"form_err_req": "{0} ist erforderlich",
				"fromx": "Von {0}",
				"generate": "Generieren",
				"hide": "verstecken",
				"inx": "in {0} {1}",
				"justnow": "gerade eben",
				"lastcomment": "Letzer Kommentar",
				"lastLogin": "Letzte Anmeldung",
				"login": "Anmelden",
				"logout": "Abmelden",
				"message": "Nachricht",
				"moderate": "Moderieren",
				"moderation": "Kommentare moderieren",
				"myprofile": "Mein Profil",
				"name": "Name",
				"never": "nie",
				"noentries": "Keine Einträge vorhanden",
				"note_dberror": "Datenbank-Update fehlgeschlagen",
				"note_loggedinas": "Angemeldet als {0}",
				"note_loginfailed": "Anmeldung fehlgeschlagen", 
				"note_logout": "Erfolgreich abgemeldet",
				"note_published0": "{0} ist jetzt geheim",
				"note_published1": "{0} ist jetzt öffentlich",
				"note_pwupdated": "Passwort für {0} geändert",
				"note_statuschg": "Status gespeichert",
				"note_xadded": "{0} hinzugefügt",
				"note_xdeleted": "{0} gelöscht",
				"note_xreactivated": "{0} reaktiviert",
				"note_xupdated": "{0} geändert",
				"openxiny": "{0} in {1} öffnen",
				"password": "Passwort",
				"playlist": ["Playlist","Playlists"],
				"post_status-1": "Versteckt (auto)",
				"post_status-2": "Versteckt (manuell)",
				"post_status1": "OK (auto)",
				"post_status2": "OK (manuell)",
				"post_time": "Post-Zeit",
				"publish": "Öffentlich",
				"q_activate": "Soll \"{0}\" aktiviert werden?",
				"q_delete": "Soll \"{0}\" wirklich gelöscht werden?",
				"refreshx": "{0} erneuern",
				"reloginonsave": "Hier änderst du deinen eigenen Account",
				"search": "Suche",
				"status": "Status",
				"switchedto": "Zu {0} gewechselt",
				"t_day": ["Tag", "Tagen"],
				"t_hour": ["Stunde", "Stunden"],
				"t_minute": ["Minute", "Minuten"],
				"t_month": ["Monat", "Monaten"],
				"t_second": ["Sekunde", "Sekunden"],
				"t_week": ["Woche", "Wochen"],
				"t_year": ["Jahr", "Jahren"],
				"token": "Token",
				"tox": "Zu {0}",
				"user": ["Benutzer","Benutzer"],
				"video": ["Video","Videos"],
				"video_time": "Video-Zeit",
				"wait_addingx": "{0} wird hinzugefügt - bitte warten.",
				"wait_takex": "Dies kann bis zu {0} {1} dauern.",
				"warning": "Warnung",
				"xago": "vor {0} {1}",
				"xepxiresy": "{0} wird ungültig {1}",
				"xony": "{0} zu {1}",
				"yourcurrentx": "Dein aktueller {0}",
			}
		};
		return vm.allLocales;
	}

})();
