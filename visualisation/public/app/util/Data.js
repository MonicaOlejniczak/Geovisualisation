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
				var x = new THREE.Vector2(-200, 200);
				var y = new THREE.Vector2(-100, 100);
				var z = new THREE.Vector2(0, 100);
				var bound = new THREE.Vector3(x, y, z);
				callback.call(this, generateData(100, bound));
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
