/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	function Light () {}

	Light.prototype.constructor = Light;

	/**
	 * Creates and returns a directional light given the options.
	 *
	 * @param options The configuration for the directional light.
	 */
	Light.createDirectionalLight = function (options) {
		// Create the directional light.
		var directionalLight = new THREE.DirectionalLight(options.color || 0xffffff, options.intensity || 0.5);
		// Get the position from the options.
		var position = options.position;
		// Check if the position exists and set it.
		if (position) {
			directionalLight.position.set(position.x, position.y, position.z);
		}
		// Get the target from the options.
		var target = options.target;
		// Set the target of the directional light.
		directionalLight.target.position.set(target.x || 0, target.y || 0, target.z || 0);
		// Return the directional light.
		return directionalLight;
	};

	/**
	 * Creates and returns a point light given the options.
	 *
	 * @param options The configuration for the point light.
	 */
	Light.createPointLight = function (options) {
		// Create the point light.
		var pointLight = new THREE.PointLight(options.color || 0xffffff, options.intensity || 1, options.distance || 0);
		// Get the position from the options.
		var position = options.position;
		// Check if the position exists and set it.
		if (position) {
			pointLight.position.set(position.x, position.y, position.z);
		}
		// Return the point light.
		return pointLight;
	};

	return Light;

});
