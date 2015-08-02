/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var SceneRenderer = require('SceneRenderer');
	var FlatSurface = require('view/surface/FlatSurface');
	var Points = require('view/points/Points');

	var Data = require('util/Data');
	var LightHelper = require('helper/Light');

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @param surface The surface of the heat map.
	 * @param projection The projection to be used with each data point.
	 * @param options The options for the renderer.
	 * @constructor
	 */
	function HeatMap (canvas, surface, projection, options) {
		var renderer = new SceneRenderer(canvas.get(0), options);
		// Setup the scene.
		var scene = renderer.getScene();
		this._setupScene(scene, renderer.getCamera(), surface.mesh);
		this.surface = surface;
		// Load the data from the test file and render the scene.
		Data.load('app/data/generate.js', this.processData.bind(this, scene, projection));
		renderer.render();
	}

	HeatMap.prototype.constructor = HeatMap;

	/**
	 * Sets up the scene by adding the lights and ground.
	 *
	 * @param scene The THREE.js scene.
	 * @param camera The perspective camera in the scene.
	 * @param surface The surface of the heat map.
	 * @private
	 */
	HeatMap.prototype._setupScene = function (scene, camera, surface) {
		// Make the camera look at the scene.
		camera.lookAt(scene.position);
		// Create the lighting and get the surface mesh.
		var lights = this._createLights();
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
	 * @param scene The THREE.js scene.
	 * @param projection The projection to be used with each data point.
	 * @param data The data being processed.
	 */
	HeatMap.prototype.processData = function (scene, projection, data) {
		projection = projection || function () {};
		var points = new Points();
		// Iterates through the data and add the points.
		for (var i = 0, len = data.length; i < len; i++) {
			points.addPoint(data[i]);
		}
		// Add the updated points to the scene.
		scene.add(points.update(scene.position, projection));
	};

	return HeatMap;

});
