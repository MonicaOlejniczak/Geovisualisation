/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var SceneRenderer = require('SceneRenderer');

	/**
	 * Initialises the visualisation.
	 *
	 * @constructor
	 */
	function Visualisation () {
		SceneRenderer.apply(this, arguments);
	}

	Visualisation.prototype = Object.create(SceneRenderer.prototype);
	Visualisation.prototype.constructor = Visualisation;

	/**
	 * Loads a data file given its url and calls the .
	 *
	 * @param url The url to read the data from.
	 * @param callback The function to be called when the data has been loaded.
	 */
	Visualisation.prototype.load = function (url, callback) {
		// Check if the url is a js file
		if (url.split('\.')[1] === 'js') {
			// Require the javascript file and use its data
			require([url], function (generateData) {
				callback.call(this, generateData(100, 50));
			}.bind(this));
		} else {
			// Make an asynchronous ajax request to retrieve the data from the specified url.
			$.getJSON(url, function (data) {
				callback.call(this, data);
			}.bind(this));
		}
	};

	return Visualisation;

});
