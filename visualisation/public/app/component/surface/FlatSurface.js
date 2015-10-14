/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var ShaderSurface = require('component/surface/ShaderSurface');

	/**
	 * Initialises the surface.
	 *
	 * @param options
	 * @constructor
	 */
	function FlatSurface (options) {
		ShaderSurface.call(this, new THREE.BoxGeometry(1, 1, 1), options);
		options = options || {};
		this.width = options.width || 256;
		this.height = options.height || 10;
		this.depth = options.depth || 128;
		this.addEventListener('load', this.onLoad.bind(this));
	}

	FlatSurface.prototype = Object.create(ShaderSurface.prototype);
	FlatSurface.prototype.constructor = FlatSurface;

	/**
	 * A method that is triggered when the surface super class has been loaded. This method adjusts the mesh so that
	 * it is of the correct scale, position and contains the appropriate surface position uniform.
	 */
	FlatSurface.prototype.onLoad = function () {
		// Scale the size of the mesh.
		this.scale.set(this.width, this.height, this.depth);
		// Set the position of the mesh so that it is below the data points.
		this.position.setY(this.height * 0.5);
		// Update the surface position uniform for the surface material.
		this.material.uniforms['uSurfacePosition'] = {type: 'f', value: this.geometry.heightSegments * 0.5};
		this.dispatchEvent({type: 'ready'});
	};

	return FlatSurface;

});
