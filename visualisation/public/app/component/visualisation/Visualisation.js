/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var SceneRenderer = require('core/SceneRenderer');
	var Skybox = require('component/skybox/Skybox');
	var Points = require('component/points/Points');

	var LightHelper = require('helper/Light');

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @param points The points collection.
	 * @param projection The projection to be used with each data point.
	 * @param surface The surface of the heat map.
	 * @param options The options for the renderer.
	 * @constructor
	 */
	function Visualisation (canvas, points, projection, surface, options) {
		options = options || {};
		this.renderer = new SceneRenderer(canvas.get(0), options);

		var scene = this.renderer.scene;

		projection = projection || function () {};
		projection.target = scene.position;

		this.points = new Points(points, projection, options);
		this.surface = surface;

		if (options.skybox !== false) {
			this.skybox = new Skybox();
			this.skybox.position.copy(this.renderer.camera.position);
			scene.add(this.skybox);
		}

		this.setupScene(scene);
		this.addEventListeners(this.renderer);

	}

	/**
	 * Adds event listeners for the heat map.
	 *
	 * @param renderer The scene renderer.
	 */
	Visualisation.prototype.addEventListeners = function (renderer) {
		if (renderer.controls && this.skybox) {
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
	Visualisation.prototype.onControls = function (event, position) {
		this.skybox.updatePosition(position);
	};

	/**
	 * Sets up the scene by adding the lights and ground.
	 *
	 * @param scene The THREE.js scene.
	 */
	Visualisation.prototype.setupScene = function (scene) {
		this.renderer.camera.lookAt(scene.position);
		scene.add(this.createLights());
		scene.add(this.surface);
		scene.add(this.points);
	};

	/**
	 * Creates and adds lights to the scene.
	 */
	Visualisation.prototype.createLights = function () {
		return LightHelper.createPointLight({
			position: new THREE.Vector3(0, 100, 300)
		});
	};

	return Visualisation;

});
