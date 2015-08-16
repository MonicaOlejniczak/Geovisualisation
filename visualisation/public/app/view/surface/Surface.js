/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Shader = require('helper/Shader');

	/**
	 * Initialises the surface.
	 *
	 * @param geometry The geometry that defines the surface being created.
	 * @constructor
	 */
	function Surface (geometry) {

		THREE.Mesh.call(this);

		this._baseDirectory = 'assets/images/earth/';
		this.source = this._baseDirectory + 'earth.png';
		this.size = 250;
		this.color = new THREE.Color(0x222222);
		this.aspectRatio = 1;
		this.colorBound = new THREE.Vector2(-100, 100);
		this._createMesh(geometry);
	}

	Surface.prototype = Object.create(THREE.Mesh.prototype);
	Surface.prototype.constructor = Surface;

	/**
	 * Creates the surface for the scene.
	 *
	 * @param geometry The geometry that defines the surface being created.
	 * @private
	 */
	Surface.prototype._createMesh = function (geometry) {
		// Create the texture and use it for the mesh material.
		var texture = this._createTexture();
		// Create the shader.
		var shader = new Shader('earth/Earth', {
			uniforms: {
				uTexture: {type: 't', value: texture},
				uColor: {type: 'c', value: this.color},
				uHue: {type: 'f', value: 1.0},
				uSaturation: {type: 'f', value: 1.0},
				uValue: {type: 'f', value: 0.5},
				uRedShift: {type: 'f', value: -100.0},
				uGreenShift: {type: 'f', value: -50.0},
				uBlueShift: {type: 'f', value: 0.0}
			}
		});
		// Load the shader and add the geometry and material to the mesh.
		shader.load().then(function (shader) {
			this.geometry = geometry;
			this.material = shader.material;
			$(this).trigger('load');
		}.bind(this));
	};

	/**
	 * Creates a texture to be used with the surface.
	 *
	 * @returns {*}
	 * @private
	 */
	Surface.prototype._createTexture = function () {
		// Load the texture using the source file stored in the ground instance variable.
		var texture = THREE.ImageUtils.loadTexture(this.source, THREE.UVMapping, this.onTextureLoad.bind(this));
		// Set the min and mag filter to linear for textures that are not a power of 2.
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		// Return the texture.
		return texture;
	};

	/**
	 * This function is triggered when the texture for the surface has loaded. It obtains the aspect ratio of the image
	 * through the loaded texture.
	 *
	 * @param texture The texture that was loaded.
	 */
	Surface.prototype.onTextureLoad = function (texture) {
		var image = texture.image;
		this.aspectRatio = image.width / image.height;
	};

	return Surface;

});
