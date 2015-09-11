/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Surface = require('component/surface/Surface');

	/**
	 * Initialises the surface.
	 *
	 * @param width The width of the surface.
	 * @param height The height of the surface.
	 * @param depth The depth of the surface.
	 * @constructor
	 */
	function FlatSurface (width, height, depth) {
		Surface.call(this, new THREE.BoxGeometry(1, 1, 1));
		this.width = width || 256;
		this.height = height || 128;
		this.depth = depth || 10;
		this.addEventListener('load', this.onLoad.bind(this));
	}

	FlatSurface.prototype = Object.create(Surface.prototype);
	FlatSurface.prototype.constructor = FlatSurface;

	/**
	 * A method that is triggered when the surface super class has been loaded. This method adjusts the mesh so that
	 * it is of the correct scale, position and contains the appropriate surface position uniform.
	 */
	FlatSurface.prototype.onLoad = function () {
		// Scale the size of the mesh.
		this.scale.set(this.width, this.depth, this.height);
		// Set the position of the mesh so that it is below the data points.
		this.position.setY(this.depth * 0.5);
		// Update the surface position uniform for the surface material.
		this.material.uniforms['uSurfacePosition'] = {type: 'f', value: this.geometry.heightSegments * 0.5};
		this.dispatchEvent({type: 'ready'});
	};

	return FlatSurface;

});
