/**
 * @author Monica Olejniczak
 */
define(['jquery', 'threejs', 'Canvas', 'util/Color'], function ($, THREE, Canvas, Color) {

	'use strict';

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	var Visualisation = function (canvas) {
		Canvas.call(this, canvas.get(0), {
			camera: {
				position: new THREE.Vector3(0, 10, 30) // The position of the camera.
			},
			controls: true                             // Enable orbit controls.
		});
		var scene = this.scene;
		// Adds a grid to the scene.
		scene.add(this.createGrid(50, 5));
		// Read the data from the test file.
		this.readData('app/data/generate.js');
		// Make the camera look at the scene.
		this.camera.lookAt(scene.position);
		// Add a base colour.
		this.color = new THREE.Color(0x376dc7);
		// Add a light.
		this.scene.add(this.createPointLight({
			position: new THREE.Vector3(0, 10, 0)
		}));
		// Render the scene.
		this.render();
	};

	Visualisation.prototype = Object.create(Canvas.prototype);
	Visualisation.prototype.constructor = Visualisation;

	/**
	 * Creates and returns a grid.
	 *
	 * @param size The size of the grid.
	 * @param step The step size for the grid. This is the amount of space between each line.
	 * @returns {THREE.GridHelper} The grid object.
	 */
	Visualisation.prototype.createGrid = function (size, step) {
		// Create and return the grid with the specified size and step size.
		return new THREE.GridHelper(size, step);
	};

	/**
	 * Reads a data file given its url.
	 *
	 * @param url The url to read the data from.
	 */
	Visualisation.prototype.readData = function (url) {
		// Check if the url is a js file
		if (url.split('\.')[1] === 'js') {
			// Require the javascript file and use its data
			require([url], function (generateData) {
				this.processData(generateData(100, 50));
			}.bind(this));
		} else {
			// Make an asynchronous ajax request to retrieve the data from the specified url.
			$.getJSON(url, function (data) {
				// Process the data retrieved from the request.
				this.processData(data);
			}.bind(this));
		}
	};

	/**
	 * Processes the data that contains the series information.
	 *
	 * @param data The data being processed.
	 */
	Visualisation.prototype.processData = function (data) {
		// Iterates through every series.
		for (var i = 0, len = data.length; i < len; i++) {
			// Processes the series on the current iteration.
			this.processSeries(data[i]);
		}
	};

	/**
	 * Processes the series data by iterating through each set of its points.
	 *
	 * @param series The series data being processed.
	 */
	Visualisation.prototype.processSeries = function (series) {
		var points = [];
		// Iterate through the series.
		for (var i = 0, len = series.length; i < len; i++) {
			// Retrieve the point from the series.
			var point = series[i];
			// Add the point to the vertices of the geometry.
			points.push(this.convertPosition(point));
		}
		// Create the curve using the points obtained from the series.
		var curve = new THREE.SplineCurve3(points);
		// Create the tube geometry and material.
		var geometry = new THREE.TubeGeometry(curve, 50, 0.05, 8, true);
		var material = new THREE.MeshLambertMaterial({
			color: this.color
		});
		// Apply alpha blending to the material.
		material.opacity = 0.85;
		material.transparent = true;
		material.blending = THREE.AdditiveBlending;
		// Create the mesh and add it to the scene.
		var mesh = new THREE.Mesh(geometry, material);
		this.scene.add(mesh);
	};

	/**
	 * Converts a point into a vector with the correct 3D space.
	 *
	 * @param point The point being converted.
	 * @returns {THREE.Vector3} The converted vector.
	 */
	Visualisation.prototype.convertPosition = function (point) {
		return new THREE.Vector3(point[0], 0.05, -point[1]);
	};

	return Visualisation;

});
