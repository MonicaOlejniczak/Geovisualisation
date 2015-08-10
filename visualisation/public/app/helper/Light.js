/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	function Light () {}

	Light.options = {
		directional: {
			color: 0xffffff,
			intensity: 0.5,
			target: new THREE.Vector3()
		},
		point: {
			color: 0xffffff,
			intensity: 1,
			distance: 0
		}
	};

	/**
	 * Creates and returns a directional light given the options.
	 *
	 * @param [options] The configuration for the directional light.
	 */
	Light.createDirectionalLight = function (options) {
		options = options || {};
		// Set the default options.
		var defaults = Light.options.directional;
		// Create the directional light.
		var directionalLight = new THREE.DirectionalLight(
			options.color || defaults.color,
			options.intensity || defaults.intensity
		);
		// Get the position from the options.
		var position = options.position;
		// Check if the position exists and set it.
		if (position) {
			directionalLight.position.copy(position);
		}
		// Set the target of the directional light.
		directionalLight.target.position.copy(options.target || defaults.target);
		// Return the directional light.
		return directionalLight;
	};

	/**
	 * Creates and returns a point light given the options.
	 *
	 * @param [options] The configuration for the point light.
	 */
	Light.createPointLight = function (options) {
		options = options || {};
		// Set the default options.
		var defaults = Light.options.point;
		// Create the point light.
		var pointLight = new THREE.PointLight(
			options.color || defaults.color,
			options.intensity || defaults.intensity,
			options.distance || defaults.distance
		);
		// Get the position from the options.
		var position = options.position;
		// Check if the position exists and set it.
		if (position) {
			pointLight.position.copy(position);
		}
		// Return the point light.
		return pointLight;
	};

	return Light;

});
