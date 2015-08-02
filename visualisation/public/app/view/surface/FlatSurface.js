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
	 * @param [height] The height of the surface.
	 * @constructor
	 */
	function FlatSurface (height) {
		Surface.call(this, new THREE.BoxGeometry(1, 1, 1));
		this.height = height || 10;
		$(this).on('load', this._onLoad.bind(this));
	}

	FlatSurface.prototype = Object.create(Surface.prototype);
	FlatSurface.prototype.constructor = FlatSurface;

	/**
	 * A method that is triggered when the surface super class has been loaded. This method adjusts the mesh so that
	 * it is of the correct scale, position and contains the appropriate surface position uniform.
	 *
	 * @private
	 */
	FlatSurface.prototype._onLoad = function () {
		var mesh = this.mesh;
		var surface = mesh.children[0];
		// Scale the size of the mesh to match the aspect ratio of the image.
		mesh.scale.set(this.size * this.aspectRatio, this.height, this.size);
		// Set the position of the mesh so that it is below the data points.
		mesh.position.setY(this.height * 0.5);
		// Update the surface position uniform for the surface material.
		surface.material.uniforms['uSurfacePosition'] = {type: 'f', value: surface.geometry.heightSegments * 0.5};
	};

	return FlatSurface;

});
