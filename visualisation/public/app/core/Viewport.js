/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	/**
	 * Initialises the viewport.
	 *
	 * @param $el
	 * @constructor
	 */
	function Viewport ($el) {
		this.$el = $el;
	}

	Viewport.prototype.offset = function () {
		return this.$el.offset();
	};

	/**
	 * A function that returns the width of the viewport.
	 *
	 * @returns {*|jQuery} The width of the viewport.
	 */
	Viewport.prototype.width = function () {
		return this.$el.width();
	};

	/**
	 * A function that returns the height of the viewport.
	 *
	 * @returns {*|jQuery} The height of the viewport.
	 */
	Viewport.prototype.height = function () {
		return this.$el.height();
	};

	return Viewport;

});
