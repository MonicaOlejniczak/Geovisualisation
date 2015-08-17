/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var $el = $('#content');

	/**
	 * Initialises the viewport.
	 *
	 * @constructor
	 */
	function Viewport () {}

	Viewport.prototype.constructor = Viewport;

	Viewport.getOffset = function () {
		return $el.offset();
	};

	/**
	 * A function that returns the width of the viewport.
	 *
	 * @returns {*|jQuery} The width of the viewport.
	 */
	Viewport.getWidth = function () {
		return $el.width();
	};

	/**
	 * A function that returns the height of the viewport.
	 *
	 * @returns {*|jQuery} The height of the viewport.
	 */
	Viewport.getHeight = function () {
		return $el.height();
	};

	return Viewport;

});
