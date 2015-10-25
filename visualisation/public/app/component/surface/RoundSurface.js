/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Shader = require('helper/Shader');
	var ShaderSurface = require('component/surface/ShaderSurface');

	/**
	 * Initialises the surface.
	 *
	 * @param radius The radius of the surface.
	 * @param options
	 * @constructor
	 */
	function RoundSurface (radius, options) {
		ShaderSurface.call(this, new THREE.SphereGeometry(1, 40, 30), options);
		this.radius = radius;
		this.configuration = {
			clouds: this.baseDirectory + 'clouds.png',
			atmosphere: {
				source: 'atmosphere/Atmosphere',
				color: new THREE.Color(0x08376b)
			}
		};
		this.addEventListener('load', this.onLoad.bind(this));
	}

	RoundSurface.prototype = Object.create(ShaderSurface.prototype);
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
		this.clouds = this.createClouds(geometry);
		this.add(this.clouds);
		//this.atmosphere = this.add(this.createAtmosphere(geometry));
		this.dispatchEvent({type: 'ready'});
	};

	/**
	 * Creates the clouds for the sphere surface and adds it to the object.
	 *
	 * @param geometry The geometry used for the surface.
	 * @returns {THREE.Mesh} The cloud mesh.
	 */
	RoundSurface.prototype.createClouds = function (geometry) {
		var config = this.configuration.clouds;
		// Load the cloud texture
		var texture = THREE.ImageUtils.loadTexture(config);
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
		return clouds;
	};

	/**
	 * Creates the atmosphere for the surface and adds it to the object.
	 *
	 * @param geometry The geometry used for the surface.
	 */
	RoundSurface.prototype.createAtmosphere = function (geometry) {
		// TODO
		var config = this.configuration.atmosphere;
		// Load the atmosphere shader.
		var shader = new Shader(config.source, {
			uniforms: {
				uColor: {type: 'c', value: config.color}
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
