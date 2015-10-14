/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	/**
	 * Initialises the surface.
	 *
	 * @param geometry The geometry that defines the surface being created.
	 * @param options The surface options.
	 * @constructor
	 */
	function Surface (geometry, options) {

		THREE.Mesh.call(this);
		options = options || {};

		this.baseGeometry = geometry;
		this.size = options.size || 250;
		this.color = options.color || new THREE.Color(0x222222);
		this.aspectRatio = 1;

	}

	Surface.prototype = Object.create(THREE.Mesh.prototype);
	Surface.prototype.constructor = Surface;

	return Surface;

});
