/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	function Convert () {}

	/**
	 * Converts a coordinate into a vector with the correct 3D space.
	 *
	 * @param x The x-coordinate being transformed.
	 * @param y The y-coordinate being transformed
	 * @param z The z-coordinate being transformed
	 * @returns {THREE.Vector3}
	 */
	Convert.transform = function (x, y, z) {
		return new THREE.Vector3(x, z, y);
	};

	return Convert;

});
