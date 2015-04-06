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
			cameraPosition: new THREE.Vector3(0, 0, 50),
			controls: true
		});
		// Read the data from the test file.
		this.readData('app/data/test.json');
		// Render the scene.
		this.render();
	};

	Visualisation.prototype = Object.create(Canvas.prototype);
	Visualisation.prototype.constructor = Visualisation;

	/**
	 * Reads a data file given its url.
	 *
	 * @param url The url to read the data from.
	 */
	Visualisation.prototype.readData = function (url) {
		// Make an asynchronous ajax request to retrieve the data from the specified url.
		$.getJSON(url, function (data) {
			// Process the data retrieved from the request.
			this.processData(data);
		}.bind(this));
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
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({
			color: Color.generate()
		});
		// Iterate through the series.
		for (var i = 0, len = series.length; i < len; i++) {
			// Retrieve the point from the series.
			var point = series[i];
			// Add the point to the vertices of the geometry.
			geometry.vertices.push(new THREE.Vector3(point[0], point[1], 0));
		}
		// Create a line with the series data and add it to the scene.
		var line = new THREE.Line(geometry, material);
		this.scene.add(line);
	};

	return Visualisation;

});
