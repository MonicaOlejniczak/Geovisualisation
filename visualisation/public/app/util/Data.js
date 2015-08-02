/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	function Data () {}

	/**
	 * Loads a data file given its url and calls the callback once it has finished loading.
	 *
	 * @param url The url to read the data from.
	 * @param callback The function to be called when the data has been loaded.
	 */
	Data.load = function (url, callback) {
		// Check if the url is a js file
		if (url.split('\.')[1] === 'js') {
			// Require the javascript file and use its data
			require([url], function (generateData) {
				callback.call(this, generateData(100, 200, 200));
			}.bind(this));
		} else {
			// Make an asynchronous ajax request to retrieve the data from the specified url.
			$.getJSON(url, function (data) {
				callback.call(this, data);
			}.bind(this));
		}
	};

	return Data;

});
