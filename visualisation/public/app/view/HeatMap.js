/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var Visualisation = require('view/Visualisation');
	var FlatSurface = require('view/surface/FlatSurface');
	var Points = require('view/points/Points');

	var LightHelper = require('helper/Light');

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	function HeatMap (canvas) {
		// Call the super class.
		Visualisation.call(this, canvas.get(0), {
			camera: {position: new THREE.Vector3(0, 100, 200)},
			mouseControls: true
		});
		this.surface = new FlatSurface();
		// Setup the scene with the surface and lights.
		this._setupScene(this.getScene());
		// Load the data from the test file and render the scene.
		this.load('app/data/generate.js', this.processData);
		this.render();
	}

	HeatMap.prototype = Object.create(Visualisation.prototype);
	HeatMap.prototype.constructor = HeatMap;

	/**
	 * Sets up the scene by adding the lights and ground.
	 *
	 * @param scene The THREE.js scene.
	 * @private
	 */
	HeatMap.prototype._setupScene = function (scene) {
		// Make the camera look at the scene.
		this.getCamera().lookAt(scene.position);
		// Create the lighting and get the surface mesh.
		var lights = this._createLights();
		var surface = this.surface.mesh;
		// Create the lights and add it to the scene.
		scene.add(lights, surface);
	};

	/**
	 * Creates and adds lights to the scene.
	 *
	 * @private
	 */
	HeatMap.prototype._createLights = function () {
		return LightHelper.createPointLight({
			position: new THREE.Vector3(0, 10, 0)
		});
	};

	/**
	 * Processes the data that contains the point information.
	 *
	 * @param data The data being processed.
	 */
	HeatMap.prototype.processData = function (data) {
		var scene = this.getScene();
		var points = new Points();
		// Iterates through the data and add the points.
		for (var i = 0, len = data.length; i < len; i++) {
			points.addPoint(data[i]);
		}
		// Add the updated points to the scene.
		scene.add(points.update(scene.position, this.surface.height));
	};

	return HeatMap;

});
