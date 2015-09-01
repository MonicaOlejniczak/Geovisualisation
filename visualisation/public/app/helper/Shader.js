/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var Promises = require('util/Promises');

	/**
	 * Constructs a shader by loading
	 *
	 * @param path The path to the shader.
	 * @param options Options for the shader.
	 * @returns {Promise}
	 * @constructor
	 */
	function Shader (path, options) {
		// Ensure the options exist.
		options = options || {};
		// Set the default parameters.
		this.loading = 0;
		this.path = path;
		this.basePath = options.basePath || 'shader/';
		this.material = new THREE.Material();
		this.uniforms = options.uniforms || {};
		this.vertex = {};
		this.fragment = {};
	}

	/**
	 * Loads the initialised shader.
	 *
	 * @returns {Promise}
	 */
	Shader.prototype.load = function () {
		return this._loadShaders().then(function () {
			this._createMaterial(this.uniforms, this.vertex, this.fragment);
			return Promise.resolve(this);
		}.bind(this));
	};

	/**
	 * Retrieves the path to load with requirejs.
	 *
	 * @param [path] The path to the shader.
	 * @returns {string}
	 */
	Shader.prototype.getPath = function (path) {
		return 'text!' + this.basePath + (path || this.path);
	};

	/**
	 * Loads the vertex and fragment shader given the path to the file.
	 *
	 * @private
	 */
	Shader.prototype._loadShaders = function () {
		var shaderPath = this.getPath();
		return Promise.all([
			this._loadShader('vertex', shaderPath + '.vert'),
			this._loadShader('fragment', shaderPath + '.frag')
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
		return Promises.requirePromise(shaderPath).then(function (shader) {
			this[name] = shader;
			return this._resolveIncludes(shader, name);
		}.bind(this));
	};

	/**
	 * Gets the includes from some shader text.
	 *
	 * @param shader The shader text.
	 * @returns {*|Array} The array of includes.
	 * @private
	 */
	Shader.prototype._getIncludes = function (shader) {
		return shader.match(/#include[\t ]+"([^"]+)"/g) || [];
	};

	/**
	 * Resolves all includes contained within the specified shader.
	 *
	 * @param shader The shader that will have its includes loaded.
	 * @param name The name of the shader.
	 * @returns {Promise}
	 * @private
	 */
	Shader.prototype._resolveIncludes = function (shader, name) {
		// Retrieve the include text in the shader given the regex.
		var includes = this._getIncludes(shader);
		// Check if any includes exist.
		if (includes.length > 0) {
			return this._loadIncludes(includes, name);
		} else {
			return Promise.resolve(this[name]);
		}
	};

	/**
	 * Loads all includes contained within a shader.
	 *
	 * @param includes The includes required by the shader.
	 * @param name The name of the shader.
	 * @returns {Promise}
	 * @private
	 */
	Shader.prototype._loadIncludes = function (includes, name) {
		var promises = [];
		// Iterate through each include.
		for (var i = 0, len = includes.length; i < len; i++) {
			// Increase how many shaders are still loading and retrieve the path to the shader.
			this.loading++;
			var include = includes[i];
			var path = include.match(/(?!#include[\t ]+")[\w+/]+.h(?=")/)[0];
			// Get the shader path.
			var shaderPath = this.getPath(path);
			// Load the shader given the path.
			promises.push(Promises.requirePromise(shaderPath).then(function (shader) {
				// Replace the include line with the shader that was loaded.
				this[name] = this[name].replace(include, shader);
				// Resolve any includes that are a part of the loaded shader.
				return this._resolveIncludes(shader, name).then(function () {
					 // Decrement how many shaders are loading and check if loading has finished.
					if ((--this.loading) == 0) {
						return Promise.resolve(this[name]);
					}
				}.bind(this));
			}.bind(this)));
		}
		return Promise.all(promises);
	};

	/**
	 * Creates the shader material given the uniforms, vertex and fragment shaders.
	 *
	 * @param uniforms The uniforms for the shader material.
	 * @param vertexShader The vertex shader.
	 * @param fragmentShader The fragment shader.
	 * @private
	 */
	Shader.prototype._createMaterial = function (uniforms, vertexShader, fragmentShader) {
		this.material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			transparent: true
		});
	};

	return Shader;

});
