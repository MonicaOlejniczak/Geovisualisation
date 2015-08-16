/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Viewport = require('Viewport');
	var MouseControls = require('controls/Mouse');
	var Raycaster = require('controls/Raycaster');
	var SceneHelper = require('helper/Scene');

	/**
	 * Initialises the scene renderer.
	 *
	 * @param element The HTML canvas.
	 * @param options Configuration options for the scene renderer.
	 * @constructor
	 */
	function SceneRenderer (element, options) {
		// Set the canvas to the element.
		var canvas = this._canvas = element;
		// Initialise the scene.
		var scene = this._scene = new THREE.Scene();
		// Initialise the camera.
		var camera = this._camera = new THREE.PerspectiveCamera(45, element.width / element.height, 0.1, 5000);
		// Get the camera options.
		var cameraOptions = options.camera;
		// Check if the camera options exist.
		if (cameraOptions) {
			// Get the camera position from the camera options and check if it exists.
			var cameraPosition = cameraOptions.position;
			if (cameraPosition) {
				// Set the camera position.
				camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
			}
			// Get the up vector from the camera options and check if it exists.
			var cameraUp = cameraOptions.up;
			if (cameraUp) {
				// Set the up vector of the camera.
				camera.up.set(cameraUp.x, cameraUp.y, cameraUp.z);
			}
		}
		// Save the viewport height and tan field of view values for resizing.
		this._viewportHeight = Viewport.getHeight();
		this._tanFOV = Math.tan(THREE.Math.degToRad(camera.fov * 0.5));
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
	 * A method called on each render. This method updates the camera aspect ratio and the renderer display size.
	 */
	SceneRenderer.prototype.resize = function () {
		// Retrieve the canvas and the camera.
		var canvas = this.getCanvas();
		var camera = this.getCamera();
		// Lookup the size the browser is displaying the canvas.
		var width = Viewport.getWidth();
		var height = Viewport.getHeight();
		// Check if the current size differs from the previous.
		if (canvas.width != width || canvas.height != height) {
			// Update the camera aspect ratio, fov and the renderer size to match the new size.
			camera.aspect = width / height;
			camera.fov = (360 / Math.PI) * Math.atan(this._tanFOV * (height / this._viewportHeight));
			camera.updateProjectionMatrix();
			this.renderer.setSize(width, height);
		}
	};

	/**
	 * An accessor method that retrieves the scene.
	 *
	 * @returns {THREE.Scene|*}
	 */
	SceneRenderer.prototype.getScene = function () {
		return this._scene;
	};

	/**
	 * An accessor method that retrieves the camera.
	 *
	 * @returns {THREE.PerspectiveCamera|*}
	 */
	SceneRenderer.prototype.getCamera = function () {
		return this._camera;
	};

	/**
	 * An accessor method that retrieves the canvas.
	 *
	 * @returns {*}
	 */
	SceneRenderer.prototype.getCanvas = function () {
		return this._canvas;
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
		this.renderer.render(this.getScene(), this.getCamera());
	};

	return SceneRenderer;

});
