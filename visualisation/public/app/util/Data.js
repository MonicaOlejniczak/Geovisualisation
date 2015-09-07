/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var Promises = require('util/Promises');

	/**
	 * Initialises the data set with the specified path.
	 *
	 * @param path The path to the data.
	 * @constructor
	 */
	function Data (path) {
		this.path = path;
	}

	/**
	 * Loads a data file given its url and calls the callback once it has finished loading.
	 */
	Data.prototype.load = function () {
		var path = this.path;
		// Check if the url is a json file and append the json! preprocessor.
		if (path.split('\.')[1] === 'json') {
			path = 'json!' + path;
		}
		// Return the resolved require promise.
		return Promises.requirePromise(path);
	};

	return Data;

});
