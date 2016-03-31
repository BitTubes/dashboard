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
			"en": {
				"1stLogin": "First Login",
				"activatex": "Activate {0}",
				"addx": "Add {0}",
				"analyzer" : "Analyzer",
				"back": "Back",
				"cancel": "Cancel",
				"comments": "Comments",
				"copyx": "Copy {0}",
				"created": "Created",
				"customer": ["Customer","Customers"],
				"default": "Default",
				"defintion": "Definition",
				"delete": "Delete",
				"deletex": "Delete {0}",
				"delme": "You are about to delete YOU OWN account",
				"developer": "Developer",
				"documentation": "Documentation",
				"edit": "Edit",
				"editx": "Edit {0}",
				"error": "Error",
				"form_err_email": "{0} has to be an email",
				"form_err_max": "{0} is too long (max {1} characters)",
				"form_err_min": "{0} is too short (min {1} characters)",
				"form_err_pattern": "{0} may only contain {1}",
				"form_err_req": "{0} is required",
				"fromx": "From {0}",
				"generate": "Generate",
				"hide": "hide",
				"inx": "in {0} {1}",
				"justnow": "just now",
				"lastcomment": "Last Comment",
				"lastLogin": "Last Login",
				"login": "Sign in",
				"logout": "Sign out",
				"message": "Message",
				"moderate": "Moderate",
				"moderation": "Moderate Comments",
				"myprofile": "My Profile",
				"name": "Name",
				"never": "never",
				"noentries": "No entries on record",
				"note_dberror": "updating database failed",
				"note_loggedinas": "Logged in as {0}",
				"note_loginfailed": "Login failed", 
				"note_logout": "Successfully signed out",
				"note_published0": "{0} is now private",
				"note_published1": "{0} is now public",
				"note_pwupdated": "Password for {0} updated",
				"note_statuschg": "Status updated",
				"note_xadded": "New {0} added",
				"note_xdeleted": "{0} deleted",
				"note_xreactivated": "{0} re-activated",
				"note_xupdated": "{0} updated",
				"openxiny": "Open {0} in {1}",
				"organisation": "Organisation",
				"other": "Other",
				"parameter": "Parameter",
				"password": "Password",
				"playlist": ["Playlist","Playlists"],
				"post_status-1": "Hidden (auto)",
				"post_status-2": "Hidden (manual)",
				"post_status1": "OK (auto)",
				"post_status2": "OK (manual)",
				"post_time": "Post-Time",
				"publish": "Public",
				"q_activate": "Do you want to activate \"{0}\"?",
				"q_delete": "Do you really want to delete \"{0}\"?",
				"refreshx": "Refresh {0}",
				"reloginonsave": "You are about to change your own account",
				"search": "Search",
				"status": "Status",
				"switchedto": "Switched to {0}",
				"t_day": ["day", "days"],
				"t_hour": ["hour", "hours"],
				"t_minute": ["minute", "minutes"],
				"t_month": ["month", "months"],
				"t_second": ["second", "seconds"],
				"t_week": ["week", "weeks"],
				"t_year": ["year", "years"],
				"token": "Token",
				"tox": "To {0}",
				"type": "Type",
				"user": ["User","Users"],
				"value": ["Value","Values"],
				"video": ["Video","Videos"],
				"video_time": "Video-Time",
				"wait_addingx": "Adding {0} - please wait.",
				"wait_takex": "This may take up to {0} {1}.",
				"warning": "Warning",
				"xago": "{0} {1} ago",
				"xepxiresy": "{0} expires {1}",
				"xfory": "{0} for {1}",
				"xony": "{0} on {1}",
				"yourcurrentx": "Your current {0}",
				"yourx": "Your {0}",
			}
		};
		return vm.allLocales;
	}

})();
