/**
 * @author Monica Olejniczak
 */
define(['jquery'], function ($) {

	'use strict';

	/**
	 * Initialises the viewport.
	 *
	 * @constructor
	 */
	var Viewport = function () {

	};

	Viewport.prototype.constructor = Viewport;

	/**
	 * A function that returns the width of the viewport.
	 *
	 * @returns {*|jQuery} The width of the viewport.
	 */
	Viewport.prototype.getWidth = function () {
		return $(window).width();
	};

	/**
	 * A function that returns the height of the viewport.
	 *
	 * @returns {*|jQuery} The height of the viewport.
	 */
	Viewport.prototype.getHeight = function () {
		return $(window).height();
	};

	return Viewport;

});
