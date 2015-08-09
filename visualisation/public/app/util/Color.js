/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	/**
	 * Initialises the color class.
	 *
	 * @constructor
	 */
	function Color () {}

	/**
	 * Generates a random colour, blended with a particular colour.
	 *
	 * @param [blend] The THREE.Color to blend with the randomly generated values.
	 * @returns {THREE.Color}
	 */
	Color.generate = function (blend) {
		var color = new THREE.Color(Math.random(), Math.random(), Math.random());
		if (blend != null) {
			color = Color.blend(color, blend);
		}
		return color;
	};

	/**
	 * Blends a colour with another.
	 *
	 * @param color The colour to be blended.
	 * @param blend The colour to blend with the original colour.
	 * @returns {*}
	 */
	Color.blend = function (color, blend) {
		color.r = (color.r + blend.r) * 0.5;
		color.g = (color.g + blend.g) * 0.5;
		color.b = (color.b + blend.b) * 0.5;
		return color;
	};

	/**
	 * Darkens or lightens a colour based on the luminance.
	 *
	 * @param color The colour being darkened or lightened.
	 * @param luminance The intensity of the luminance.
	 * @returns {THREE.Color}
	 */
	Color.luminance = function (color, luminance) {
		var red = Math.max(0, Math.min(1, color.r + luminance));
		var green = Math.max(0, Math.min(1, color.g + luminance));
		var blue = Math.max(0, Math.min(1, color.b + luminance));
		return new THREE.Color(red, green, blue);
	};

	return Color;

});
