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
		// Return the resolved require promise.
		return Promises.requirePromise(this.path);
	};

	return Data;

});
