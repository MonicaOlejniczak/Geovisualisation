/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Visualisation = require('view/Visualisation');
	var LightHelper = require('helper/Light');
	var Color = require('util/Color');
	var VertexShader = require('text!shader/gradient/Gradient.vert');
	var FragmentShader = require('text!shader/gradient/Gradient.frag');

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	function HeatMap (canvas) {
		Visualisation.call(this, canvas.get(0), {
			camera: {position: new THREE.Vector3(0, 10, 30)},
			mouseControls: true
		});
		// Set the width and height of the geometry.
		this.width = this.height = 1;
		// Set the colors to be used with the points.
		this.colors = {
			low: new THREE.Color(0x00ff00),
			medium: new THREE.Color(0x52c5e5),
			high: new THREE.Color(0xff0000)
		};
		// Set the vertex and fragment shaders.
		this.vertexShader = VertexShader;
		this.fragmentShader = FragmentShader;
		// Initialise the min and max of the data.
		this.min = this.max = 0;
		// Obtain the scene.
		var scene = this.getScene();
		// Make the camera look at the scene.
		this.getCamera().lookAt(scene.position);
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
	 * Processes the data that contains the point information.
	 *
	 * @param data The data being processed.
	 */
	HeatMap.prototype.processData = function (data) {
		var points = [];
		// Iterates through the data.
		for (var i = 0, len = data.length; i < len; i++) {
			// Obtain the current point and pre-process it.
			var point = data[i];
			points.push(point, this.preProcessPoint(point));
		}
		this.processPoints(points);
	};

	/**
	 * Pre-processes the point data by obtaining the min and max bounds of the data.
	 *
	 * @param point The point being pre-processed.
	 * @returns {THREE.BoxGeometry}
	 */
	HeatMap.prototype.preProcessPoint = function (point) {
		// Create the geometry and compute its bounding box.
		var geometry = this.createGeometry(point[2]);
		geometry.computeBoundingBox();
		// Obtain the bounding box of the geometry and set the min and max values.
		var boundingBox = geometry.boundingBox;
		this.min = Math.min(this.min, boundingBox.min.y);
		this.max = Math.max(this.max, boundingBox.max.y);
		return geometry;
	};

	/**
	 * Processed the points data by creating the point meshes and adding them to the scene.
	 *
	 * @param points The points being processed.
	 */
	HeatMap.prototype.processPoints = function (points) {
		// Retrieve the scene and set the target to its position.
		var scene = this.getScene();
		var target = scene.position;
		// Get the colors being used with the point and create a mesh to add the points to.
		var colors = this.colors;
		var mesh = new THREE.Mesh();
		// Iterate through each point.
		for (var i = 0, len = points.length; i < len; i+=2) {
			// Processes the current point in the data.
			mesh.add(this.processPoint(points[i], points[i + 1], target, colors));
		}
		// Add every point to the scene.
		scene.add(mesh);
	};

	/**
	 * Processes a point by creating a mesh and applying transforms to set its position.
	 *
	 * @param point The original data point.
	 * @param geometry The geometry that was created from pre-processing.
	 * @param target The target position for the point to look at.
	 * @param colors The colors being used with the point.
	 * @returns {THREE.Mesh}
	 */
	HeatMap.prototype.processPoint = function (point, geometry, target, colors) {
		// Obtain the magnitude from the point.
		var magnitude =  point[2];
		// Create the shader material with the specified uniforms and shaders.
		var material = new THREE.ShaderMaterial({
			uniforms: {
				uMin: {type: 'f', value: this.min},
				uMax: {type: 'f', value: this.max},
				uMagnitude: {type: 'f', value: magnitude},
				uLowColor: {type: 'c', value: colors.low},
				uMediumColor: {type: 'c', value: colors.medium},
				uHighColor: {type: 'c', value: colors.high},
				uBasePosition: {type: 'v3', value: geometry.boundingBox.min}
			},
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader
		});
		// Transform the position into the correct coordinates and create the mesh.
		var position = this.transform(point[0], point[1], magnitude);
		var mesh = new THREE.Mesh(geometry, material);
		// Rotate the mesh so it is looking at the target vector.
		mesh.lookAt(target);
		// Set the position of the mesh and adjust its y-position so that it is above the ground.
		mesh.position.set(position.x, position.y, position.z);
		mesh.position.setY(Math.abs(mesh.position.y) * 0.5);
		// Return the mesh that was created.
		return mesh;
	};

	/**
	 * Creates and returns the geometry using its transformed coordinates.
	 *
	 * @param magnitude The magnitude of the geometry.
	 * @returns {THREE.BoxGeometry}
	 */
	HeatMap.prototype.createGeometry = function (magnitude) {
		var transform = this.transform(this.width, this.height, magnitude);
		return new THREE.BoxGeometry(transform.x, transform.y, transform.z);
	};

	return HeatMap;

});
