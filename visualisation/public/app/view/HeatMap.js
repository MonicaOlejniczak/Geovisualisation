/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Visualisation = require('view/Visualisation');
	var LightHelper = require('helper/Light');
	var Color = require('util/Color');

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	function HeatMap (canvas) {
		Visualisation.call(this, canvas.get(0), {
			camera: {
				position: new THREE.Vector3(0, 10, 30)
			},
			grid: {
				size: 50,
				step: 5
			},
			mouseControls: true
		});
		var scene = this.getScene();
		var camera = this.getCamera();
		// Make the camera look at the scene.
		camera.lookAt(scene.position);
		// Add a base colour.
		this.color = new THREE.Color(0x376dc7);
		// Add a light to the scene.
		scene.add(LightHelper.createPointLight({
			position: new THREE.Vector3(0, 10, 0)
		}));
		// Load the data from the test file and render the scene.
		this.load('app/data/generate.js', this.processData);
		this.render();
	}

	HeatMap.prototype = Object.create(Visualisation.prototype);
	HeatMap.prototype.constructor = HeatMap;

	/**
	 * Processes the data that contains the series information.
	 *
	 * @param data The data being processed.
	 */
	HeatMap.prototype.processData = function (data) {
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
	HeatMap.prototype.processSeries = function (series) {
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
		var geometry = new THREE.TubeGeometry(curve, 50, 0.1, 8, false);
		var material = new THREE.MeshLambertMaterial({
			color: this.color
		});
		// Apply alpha blending to the material.
		material.opacity = 0.95;
		material.transparent = true;
		material.blending = THREE.AdditiveBlending;
		// Create the mesh and add it to the scene.
		var mesh = new THREE.Mesh(geometry, material);
		//var wireframe = new THREE.WireframeHelper(mesh, 0xffffff);
		this.getScene().add(mesh);
		//this.scene.add(wireframe);
	};

	/**
	 * Converts a point into a vector with the correct 3D space.
	 *
	 * @param point The point being converted.
	 * @returns {THREE.Vector3} The converted vector.
	 */
	HeatMap.prototype.convertPosition = function (point) {
		return new THREE.Vector3(point[0], 0.01, -point[1]);
	};

	return HeatMap;

});
