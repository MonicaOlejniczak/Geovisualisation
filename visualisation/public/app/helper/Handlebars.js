/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var Handlebars = require('handlebars');

	function HandlebarsHelper () {
		Handlebars.registerHelper('capitalize', this.capitalize.bind(this));
		Handlebars.registerHelper('format', this.format.bind(this));
	}

	/**
	 * Capitalizes the specified string.
	 *
	 * @param str The string to capitalize.
	 * @returns {string}
	 */
	HandlebarsHelper.prototype.capitalize = function (str) {
		str = str.replace('_', ' ');
		return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
	};

	/**
	 * Formats a value based on its type.
	 *
	 * @param value The value to format.
	 * @returns {*} The formatted value.
	 */
	HandlebarsHelper.prototype.format = function (value) {
		if (typeof value === 'number') {
			return this.formatNumber(value);
		} else if (typeof value === 'object') {
			if (value instanceof THREE.Vector2 || value instanceof THREE.Vector3 || value instanceof THREE.Vector4) {
				return this.formatVector(value);
			}
		}
		return value;
	};

	/**
	 * The function that formats a Vector.
	 *
	 * @param vector The vector being formatted.
	 * @returns {string} The formatted vector.
	 */
	HandlebarsHelper.prototype.formatVector = function (vector) {
		// Initialise the str that will be returned.
		var str = '[';
		// Get the keys from the vector and its length.
		var keys = Object.keys(vector);
		var len = keys.length;
		// Iterate through each key in the vector.
		keys.forEach(function (key, index) {
			// Append the formatted number to the string, followed by a ', ' if the current iteration is not at the
			// last key.
			str += this.formatNumber(vector[key]) + (index < len - 1 ? ', ' : '');
		}, this);
		// Return the string with a closing bracket.
		return str + ']';
	};

	/**
	 * Formats a number to a particular precision.
	 *
	 * @param value The number being formatted.
	 * @returns {string|*}
	 */
	HandlebarsHelper.prototype.formatNumber = function (value) {
		return value.toLocaleString().replace(/,/g, ', ');
	};

	return HandlebarsHelper;

});
