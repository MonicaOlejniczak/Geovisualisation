/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Surface = require('view/surface/Surface');

	/**
	 * Initialises the surface.
	 *
	 * @param [radius] The radius of the surface.
	 * @constructor
	 */
	function RoundSurface (radius) {
		Surface.call(this, new THREE.SphereGeometry(1, 32, 32));
		this.radius = radius || this.size * 0.5;
		$(this).on('load', this._onLoad.bind(this));
	}

	RoundSurface.prototype = Object.create(Surface.prototype);
	RoundSurface.prototype.constructor = RoundSurface;

	/**
	 * A method that is triggered when the surface super class has been loaded. This method adjusts the mesh so that
	 * it is of the correct scale and has the correct surface position uniform.
	 *
	 * @private
	 */
	RoundSurface.prototype._onLoad = function () {
		var mesh = this.mesh;
		mesh.scale.set(this.radius, this.radius, this.radius);
		// Update the surface position uniform for the surface material.
		mesh.material.uniforms['uSurfacePosition'] = {type: 'f', value: -this.radius};
	};

	return RoundSurface;

});
