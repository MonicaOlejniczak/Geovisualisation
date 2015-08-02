/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	/**
	 * Constructs a shader by loading
	 *
	 * @param path The path to the shader.
	 * @param options Options for the shader.
	 * @returns {Promise}
	 * @constructor
	 */
	function Shader (path, options) {
		return new Promise(function (resolve) {
			this.loading = 0;
			this.basePath = 'text!shader/';
			this.material = new THREE.Material();
			this.uniforms = options && options.uniforms || {};
			this.vertex = {};
			this.fragment = {};
			this._loadShaders(path).then(function () {
				resolve(this._createMaterial(this.uniforms, this.vertex, this.fragment));
			}.bind(this));
		}.bind(this));
	}

	/**
	 * Loads the vertex and fragment shader given the path to the file.
	 *
	 * @param path The path to the shader.
	 * @private
	 */
	Shader.prototype._loadShaders = function (path) {
		return Promise.all([
			this._loadShader('vertex', this.basePath + path + '.vert'),
			this._loadShader('fragment', this.basePath + path + '.frag')
		]);
	};

	/**
	 * Loads a shader by loading it and any includes it contains.
	 *
	 * @param name The name of the shader being loaded.
	 * @param shaderPath The path to the shader.
	 * @returns {Promise}
	 * @private
	 */
	Shader.prototype._loadShader = function (name, shaderPath) {
		return new Promise(function (resolve) {
			require([shaderPath], function (shader) {
				this[name] = shader;
				this._loadIncludes(shader, name, resolve);
			}.bind(this));
		}.bind(this));
	};

	/**
	 * Loads all includes contained within the specified shader.
	 *
	 * @param shader The shader that will have its includes loaded.
	 * @param name The name of the shader.
	 * @param resolve The resolve function for the current promise.
	 * @private
	 */
	Shader.prototype._loadIncludes = function (shader, name, resolve) {
		// Retrieve the include text in the shader given the regex.
		var includes = shader.match(/#include[\t ]+"([^"]+)"/g) || [];
		// Check if any includes exist.
		if (includes.length > 0) {
			// Iterate through each include.
			for (var i = 0, len = includes.length; i < len; i++) {
				// Increase how many shaders are still loading and retrieve the path to the shader.
				this.loading++;
				var include = includes[i];
				var path = include.match(/(?!#include[\t ]+")[\w+/]+.h(?=")/)[0];
				// Load the shader given the path.
				require([this.basePath + path], function (include, loadedShader) {
					// Load any includes that are a part of the loaded shader.
					this._loadIncludes(loadedShader, name, resolve);
					// Replace the include line with the shader that was loaded.
					this[name] = this[name].replace(include, loadedShader);
					// Decrement how many shaders are loading and check if loading has finished.
					if ((--this.loading) == 0) {
						resolve();
					}
				}.bind(this, include));
			}
		} else {
			resolve();
		}
	};

	/**
	 * Creates the shader material given the uniforms, vertex and fragment shaders.
	 *
	 * @param uniforms The uniforms for the shader material.
	 * @param vertexShader The vertex shader.
	 * @param fragmentShader The fragment shader.
	 * @returns {THREE.ShaderMaterial}
	 * @private
	 */
	Shader.prototype._createMaterial = function (uniforms, vertexShader, fragmentShader) {
		return this.material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		});
	};

	return Shader;

});
