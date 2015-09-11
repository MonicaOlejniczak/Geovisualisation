/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Shader = require('helper/Shader');
	var Surface = require('component/surface/Surface');

	/**
	 * Initialises the surface.
	 *
	 * @param [radius] The radius of the surface.
	 * @constructor
	 */
	function RoundSurface (radius) {
		Surface.call(this, new THREE.SphereGeometry(1, 40, 30));
		//this.radius = radius || this.size * 0.25;
		this.clouds = this.baseDirectory + 'clouds.png';
		this.radius = radius || this.size * 0.5;
		this.atmosphere = {
			source: 'atmosphere/Atmosphere',
			color: new THREE.Color(0x08376b)
		};
		this.addEventListener('load', this.onLoad.bind(this));
	}

	RoundSurface.prototype = Object.create(Surface.prototype);
	RoundSurface.prototype.constructor = RoundSurface;

	/**
	 * A method that is triggered when the surface super class has been loaded. This method adjusts the mesh so that
	 * it is of the correct scale and has the correct surface position uniform.
	 */
	RoundSurface.prototype.onLoad = function () {
		var geometry = this.geometry;
		// Rotate the surface by -90deg so spherical projections are correct.
		this.rotateY(-Math.PI * 0.5);
		// Scale the surface to its radius.
		this.scale.set(this.radius, this.radius, this.radius);
		// Update the surface position uniform for the surface material.
		this.material.uniforms['uSurfacePosition'] = {type: 'f', value: -this.radius};
		// Add the clouds and the atmosphere.
		this.clouds = this.addClouds(geometry);
		//this.atmosphere = this.addAtmosphere(geometry);
		this.dispatchEvent({type: 'ready'});
	};

	/**
	 * Creates the clouds for the sphere surface and adds it to the object.
	 *
	 * @param geometry The geometry used for the surface.
	 * @returns {THREE.Mesh} The cloud mesh.
	 */
	RoundSurface.prototype.addClouds = function (geometry) {
		// Load the cloud texture
		var texture = THREE.ImageUtils.loadTexture(this.clouds);
		// Load the material with the texture.
		var material = new THREE.MeshBasicMaterial({
			map: texture,
			opacity: 0.8,
			transparent: true
		});
		// Create the clouds with the geometry and material.
		var clouds = new THREE.Mesh(geometry, material);
		// Scale the mesh to prevent z-fighting.
		var scale = 1.005;
		clouds.scale.set(scale, scale, scale);
		// Add the clouds and trigger an event.
		this.add(clouds);
		return clouds;
	};

	/**
	 * Creates the atmosphere for the surface and adds it to the object.
	 *
	 * @param geometry The geometry used for the surface.
	 */
	RoundSurface.prototype.addAtmosphere = function (geometry) {
		// TODO
		var atmosphere = this.atmosphere;
		// Load the atmosphere shader.
		var shader = new Shader(atmosphere.source, {
			uniforms: {
				uColor: {type: 'c', value: atmosphere.color}
			}
		});
		shader.load().then(function (shader) {
			var material = shader.material;
			// Update the material options.
			material.side = THREE.BackSide;
			material.transparent = true;
			// Create the atmosphere.
			var atmosphere = new THREE.Mesh(geometry, material);
			// Scale the mesh to prevent z-fighting and add it to the object.
			var scale = this.radius * 1.175;
			atmosphere.scale.set(scale, scale, scale);
			// Add the atmosphere and trigger an event.
			this.add(atmosphere);
		}.bind(this));
	};

	return RoundSurface;

});
