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
		this._baseDirectory = 'assets/images/earth/';
		this.source = this._baseDirectory + 'earth.png';
		this.size = 250;
		this.color = new THREE.Color(0x222222);
		this.aspectRatio = 1;
		this.colorBound = new THREE.Vector2(-100, 100);
		this.mesh = new THREE.Mesh();
		this.mesh.add(this._createMesh(geometry));
	}

	Surface.prototype.constructor = Surface;

	/**
	 * Creates the surface for the scene.
	 *
	 * @param geometry The geometry that defines the surface being created.
	 * @private
	 */
	Surface.prototype._createMesh = function (geometry) {
		// Create a mesh that can be passed into the map.
		var mesh = new THREE.Mesh();
		// Create the texture and use it for the mesh material.
		var texture = this._createTexture(mesh);
		// Create the shader and add the geometry and material to the mesh.
		new Shader('earth/Earth', {
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
		}).then(function (material) {
				mesh.geometry = geometry;
				mesh.material = material;
				$(this).trigger('load', material);
			}.bind(this));
		// Return the surface mesh.
		return mesh;
	};

	/**
	 * Creates a texture to be used with the surface.
	 *
	 * @param mesh The surface mesh.
	 * @returns {*}
	 * @private
	 */
	Surface.prototype._createTexture = function (mesh) {
		// Load the texture using the source file stored in the ground instance variable.
		var texture = THREE.ImageUtils.loadTexture(this.source, THREE.UVMapping, this._onTextureLoad.bind(this, mesh));
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
	 * @param mesh The surface mesh.
	 * @param texture The texture that was loaded.
	 * @private
	 */
	Surface.prototype._onTextureLoad = function (mesh, texture) {
		var image = texture.image;
		this.aspectRatio = image.width / image.height;
	};

	return Surface;

});
