/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var MouseControls = require('controls/Mouse');
	var Raycaster = require('core/Raycaster');
	var SceneHelper = require('helper/Scene');

	/**
	 * Initialises the scene renderer.
	 *
	 * @param element The HTML canvas.
	 * @param [options] Configuration options for the scene renderer.
	 * @constructor
	 */
	function SceneRenderer (element, options) {
		options = options || {};
		// Set the canvas to the element.
		var canvas = this.canvas = element;
		// Initialise the scene.
		var scene = this.scene = new THREE.Scene();
		// Initialise the camera.
		var camera = this.camera = new THREE.PerspectiveCamera(45, element.width / element.height, 0.1, 5000);
		// Get the camera options.
		var cameraOptions = options.camera;
		// Check if the camera options exist.
		if (cameraOptions) {
			// Get the camera position from the camera options and check if it exists.
			var cameraPosition = cameraOptions.position;
			if (cameraPosition) {
				camera.position.copy(cameraPosition);
			}
			// Get the up vector from the camera options and check if it exists.
			var cameraUp = cameraOptions.up;
			if (cameraUp) {
				camera.up.copy(cameraUp);
			}
		}
		// Save the viewport height and tan field of view values for resizing.
		//this.viewportHeight = Viewport.getHeight();
		//this.tanFOV = Math.tan(THREE.Math.degToRad(camera.fov * 0.5));
		// Initialise the WebGL renderer.
		this.renderer = new THREE.WebGLRenderer({
			canvas: element,
			alpha: true,
			antialias: true
		});
		// Check if a grid is being added to the scene.
		if (options.grid) {
			scene.add(SceneHelper.createGrid(options.grid));
		}
		// Check if axes are being added to the scene.
		if (options.axes) {
			// Add the axes to the scene.
			scene.add(SceneHelper.createAxes());
		}
		// Check if the mouse controls are enabled.
		if (options.mouseControls) {
			this.controls = new MouseControls(camera, element);
		}

		// Check if raycasting is enabled.
		var raycaster = options.raycaster;
		if (raycaster) {
			var parent = raycaster.parent || scene;
			this.raycaster = new Raycaster(canvas, camera, parent);
		}

	}

	/**
	 * A method called on each render that checks if a resize needs to be applied.
	 */
	SceneRenderer.prototype.resize = function () {
		// Retrieve the canvas and the camera.
		var viewport = app.viewport;
		var canvas = this.canvas;
		// Lookup the size the browser is displaying the canvas.
		var width = viewport.width();
		var height = viewport.height();
		// Check if a resize needs to be applied.
		if (canvas.width != width || canvas.height != height) {
			this.camera.aspect = width / height;
			//camera.fov = (360 / Math.PI) * Math.atan(this.tanFOV * (height / this.viewportHeight));
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(width, height);
		}
	};

	/**
	 * Sets the raycaster for the scene.
	 *
	 * @param parent The parent element to check for intersections.
	 */
	SceneRenderer.prototype.setRaycaster = function (parent) {
		parent = parent || this.scene;
		this.raycaster = new Raycaster(this.canvas, this.camera, parent);
	};

	/**
	 * The rendering function that updates the canvas.
	 */
	SceneRenderer.prototype.render = function () {
		requestAnimationFrame(this.render.bind(this));
		this.resize();
		if (this.raycaster) {
			this.raycaster.update();
		}
		this.renderer.render(this.scene, this.camera);
	};

	return SceneRenderer;

});
