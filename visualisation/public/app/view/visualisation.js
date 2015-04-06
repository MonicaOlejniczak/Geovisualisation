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
			controls: true                              // Enable orbit controls.
		});
		var scene = this.scene;
		// Adds a grid to the scene.
		scene.add(this.createGrid(50, 5));
		// Read the data from the test file.
		this.readData('app/data/generate.js');
		this.camera.lookAt(scene.position);
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
			points.push(this.convertPoint(point));
		}
		// Create the curve using the points obtained from the series.
		var curve = new THREE.SplineCurve3(points);
		var geometry = new THREE.Geometry();
		geometry.vertices = curve.getPoints(50);
		var material = new THREE.LineBasicMaterial({
			color: Color.generate()
		});
		var line = new THREE.Line(geometry, material);
		this.scene.add(line);
	};

	/**
	 * Converts a point into a vector with the correct 3D space.
	 *
	 * @param point The point being converted.
	 * @returns {THREE.Vector3} The converted vector.
	 */
	Visualisation.prototype.convertPoint = function (point) {
		return new THREE.Vector3(point[0], 0.01, -point[1]);
	};

	return Visualisation;

});
