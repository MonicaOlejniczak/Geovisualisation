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
	 *
	 * @returns {Promise}
	 */
	Shader.prototype.load = function () {
		return new Promise(function (resolve) {
			this._loadShaders().then(function () {
				this._createMaterial(this.uniforms, this.vertex, this.fragment);
				resolve(this);
			}.bind(this));
		}.bind(this));
	};

	/**
	 * Retrieves the path to load with requirejs.
	 *
	 * @param [path] The path to the shader.
	 * @returns {string}
	 * @private
	 */
	Shader.prototype._getPath = function (path) {
		return 'text!' + this.basePath + (path || this.path);
	};

	/**
	 * Loads the vertex and fragment shader given the path to the file.
	 *
	 * @private
	 */
	Shader.prototype._loadShaders = function () {
		var shaderPath = this._getPath();
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
		return new Promise(function (resolve) {
			require([shaderPath], function (shader) {
				this[name] = shader;
				this._resolveIncludes(shader, name, resolve);
			}.bind(this));
		}.bind(this));
	};

	/**
	 * Resolves all includes contained within the specified shader.
	 *
	 * @param shader The shader that will have its includes loaded.
	 * @param name The name of the shader.
	 * @param resolve The resolve function.
	 * @returns {Promise}
	 * @private
	 */
	Shader.prototype._resolveIncludes = function (shader, name, resolve) {
		// Retrieve the include text in the shader given the regex.
		var includes = shader.match(/#include[\t ]+"([^"]+)"/g) || [];
		// Check if any includes exist.
		if (includes.length > 0) {
			return this._loadIncludes(includes, name, resolve);
		} else {
			resolve(this[name]);
		}
	};

	/**
	 * Loads all includes contained within a shader.
	 *
	 * @param includes The includes required by the shader.
	 * @param name The name of the shader.
	 * @param resolve The resolve function.
	 * @returns {Promise}
	 * @private
	 */
	Shader.prototype._loadIncludes = function (includes, name, resolve) {
		// Iterate through each include.
		for (var i = 0, len = includes.length; i < len; i++) {
			// Increase how many shaders are still loading and retrieve the path to the shader.
			this.loading++;
			var include = includes[i];
			var path = include.match(/(?!#include[\t ]+")[\w+/]+.h(?=")/)[0];
			// Get the shader path.
			var shaderPath = this._getPath(path);
			// Load the shader given the path.
			require([shaderPath], function (include, loadedShader) {
				// Resolve any includes that are a part of the loaded shader.
				this._resolveIncludes(loadedShader, name, resolve);
				// Replace the include line with the shader that was loaded.
				this[name] = this[name].replace(include, loadedShader);
				// Decrement how many shaders are loading and check if loading has finished.
				if ((--this.loading) == 0) {
					resolve(this[name]);
				}
			}.bind(this, include));
		}
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
			fragmentShader: fragmentShader
		});
	};

	return Shader;

});
