/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var SceneRenderer = require('SceneRenderer');
	var Skybox = require('view/skybox/Skybox');
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
		this.renderer = new SceneRenderer(canvas.get(0), options);
		this.points = new Points(options);
		this.skybox = new Skybox(this.renderer.getCamera());
		this.surface = surface;
		var scene = this.renderer.getScene();
		// Setup the scene.
		this._setupScene(scene);
		// Add the event listeners.
		this.addEventListeners(this.renderer);
		// Load the data from the test file and render the scene.
		Data.load('app/data/generate.js', this.processData.bind(this, scene, projection));
		this.renderer.render();
	}

	/**
	 * Adds event listeners for the heat map.
	 *
	 * @param renderer The scene renderer.
	 */
	HeatMap.prototype.addEventListeners = function (renderer) {
		if (renderer.controls) {
			$(renderer.controls).on({
				zoom: this.onControls.bind(this),
				pan: this.onControls.bind(this),
				rotate: this.onControls.bind(this)
			});
		}
	};

	/**
	 * An event triggered when the controls are being used.
	 *
	 * @param event The jQuery event.
	 * @param position The position of the camera.
	 */
	HeatMap.prototype.onControls = function (event, position) {
		this.skybox.updatePosition(position);
	};

	/**
	 * Sets up the scene by adding the lights and ground.
	 *
	 * @param scene The THREE.js scene.
	 * @private
	 */
	HeatMap.prototype._setupScene = function (scene) {
		// Make the camera look at the scene.
		this.renderer.getCamera().lookAt(scene.position);
		// Create the lighting and get the surface mesh.
		var lights = this._createLights();
		// Create the lights and add it to the scene.
		scene.add(lights, this.surface, this.skybox);
	};

	/**
	 * Creates and adds lights to the scene.
	 *
	 * @private
	 */
	HeatMap.prototype._createLights = function () {
		return LightHelper.createPointLight({
			position: new THREE.Vector3(0, 100, 300)
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
		projection.target = scene.position;
		var points = this.points;
		points.addPoints(data, projection);
		scene.add(points);
	};

	return HeatMap;

});
