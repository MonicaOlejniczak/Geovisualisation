/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Shader = require('helper/Shader');
	var Surface = require('view/surface/Surface');

	/**
	 * Initialises the surface.
	 *
	 * @param [radius] The radius of the surface.
	 * @constructor
	 */
	function RoundSurface (radius) {
		Surface.call(this, new THREE.SphereGeometry(1, 40, 30));
		//this.radius = radius || this.size * 0.25;
		this.clouds = this._baseDirectory + 'clouds.png';
		this.radius = radius || this.size * 0.5;
		this._atmosphere = {
			source: 'atmosphere/Atmosphere',
			color: new THREE.Color(0x08376b)
		};
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
		var surface = mesh.children[0];
		var geometry = surface.geometry;
		// Scale the surface to its radius.
		surface.scale.set(this.radius, this.radius, this.radius);
		// Update the surface position uniform for the surface material.
		surface.material.uniforms['uSurfacePosition'] = {type: 'f', value: -this.radius};
		// Add the clouds and the atmosphere.
		this._addClouds(surface, geometry);
		this._addAtmosphere(mesh, geometry);
	};

	/**
	 * Creates the clouds for the sphere surface and adds it to the object.
	 *
	 * @param object The object to add the clouds to.
	 * @param geometry The geometry used for the surface.
	 * @returns {THREE.Mesh} The cloud mesh.
	 * @private
	 */
	RoundSurface.prototype._addClouds = function (object, geometry) {
		// Load the cloud texture
		var texture = THREE.ImageUtils.loadTexture(this.clouds);
		texture.minFilter = THREE.NearestMipMapLinearFilter;
		texture.magFilter = THREE.NearestMipMapLinearFilter;
		// Load the material with the texture.
		var material = new THREE.MeshBasicMaterial({
			map: texture,
			opacity: 0.8,
			transparent: true
		});
		// Create the mesh with the geometry and material.
		var mesh = new THREE.Mesh(geometry, material);
		// Scale the mesh to prevent z-fighting.
		var scale = 1.005;
		mesh.scale.set(scale, scale, scale);
		object.add(mesh);
		$(this).trigger('clouds', mesh);
	};

	/**
	 * Creates the atmosphere for the surface and adds it to the object.
	 *
	 * @param object The object to add the atmosphere to.
	 * @param geometry The geometry used for the surface.
	 * @private
	 */
	RoundSurface.prototype._addAtmosphere = function (object, geometry) {
		var atmosphere = this._atmosphere;
		// Load the atmosphere shader.
		new Shader(atmosphere.source, {
			uniforms: {
				uColor: {type: 'c', value: atmosphere.color}
			}
		}).then(function (material) {
			// Update the material options and the mesh material.
			material.side = THREE.BackSide;
			material.transparent = true;
			var mesh = new THREE.Mesh(geometry, material);
			// Scale the mesh to prevent z-fighting and add it to the object.
			var scale = this.radius * 1.175;
			mesh.scale.set(scale, scale, scale);
			object.add(mesh);
			$(this).trigger('atmosphere', mesh);
		}.bind(this));
	};

	return RoundSurface;

});
