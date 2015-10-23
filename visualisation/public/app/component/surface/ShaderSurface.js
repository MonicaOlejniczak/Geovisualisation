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
	 * @param geometry The geometry that defines the surface being created.
	 * @param options
	 * @constructor
	 */
	function ShaderSurface (geometry, options) {

		Surface.call(this, geometry, options);

		this.baseDirectory = 'assets/images/earth/';
		this.source = this.baseDirectory + 'earth.png';
		this.aspectRatio = 1;
		this.colorBound = new THREE.Vector2(-100, 100);
		this.load();

	}

	ShaderSurface.prototype = Object.create(Surface.prototype);
	ShaderSurface.prototype.constructor = ShaderSurface;

	/**
	 * Loads the surface for the scene.
	 */
	ShaderSurface.prototype.load = function () {
		// Create the texture and use it for the mesh material.
		var texture = this.createTexture();
		// Create the shader.
		var shader = new Shader('surface/Surface', {
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
		shader.load().then(this.onShaderLoad.bind(this));
	};

	/**
	 * Creates a texture to be used with the surface.
	 *
	 * @returns {*}
	 */
	ShaderSurface.prototype.createTexture = function () {
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
	ShaderSurface.prototype.onTextureLoad = function (texture) {
		var image = texture.image;
		this.aspectRatio = image.width / image.height;
		this.dispatchEvent({type: 'texture'});
	};

	/**
	 * This function is triggered when the shader is loaded. It sets the geometry and material of the surface and
	 * dispatches a load event.
	 *
	 * @param shader The shader material.
	 */
	ShaderSurface.prototype.onShaderLoad = function (shader) {
		this.geometry = this.baseGeometry;
		this.material = shader.material;
		this.dispatchEvent({type: 'load'});
	};

	return ShaderSurface;

});
