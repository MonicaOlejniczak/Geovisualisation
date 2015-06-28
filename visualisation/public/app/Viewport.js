/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');

	/**
	 * Initialises the viewport.
	 *
	 * @constructor
	 */
	function Viewport () {}

	Viewport.prototype.constructor = Viewport;

	/**
	 * A function that returns the width of the viewport.
	 *
	 * @returns {*|jQuery} The width of the viewport.
	 */
	Viewport.getWidth = function () {
		return $(window).width();
	};

	/**
	 * A function that returns the height of the viewport.
	 *
	 * @returns {*|jQuery} The height of the viewport.
	 */
	Viewport.getHeight = function () {
		return $(window).height();
	};

	return Viewport;

});
