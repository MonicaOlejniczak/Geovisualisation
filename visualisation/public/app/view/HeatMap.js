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
			medium: new THREE.Color(0xffff00),
			high: new THREE.Color(0xff0000),
		};
		// Set the vertex and fragment shaders.
		this.vertexShader = VertexShader;
		this.fragmentShader = FragmentShader;
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
	 * Processes the data that contains the series information.
	 *
	 * @param data The data being processed.
	 */
	HeatMap.prototype.processData = function (data) {
		var scene = this.getScene();
		var target = scene.position;
		var points = new THREE.Mesh();
		var colors = this.colors;
		// Iterates through each point.
		for (var i = 0, len = data.length; i < len; i++) {
			// Processes the current point in the data.
			points.add(this.processPoint(target, data[i], colors));
		}
		scene.add(points);
	};

	/**
	 * Processes the point data.
	 *
	 * @param target The target position for the point to look at.
	 * @param point The point being processed.
	 * @param colors The colors being used with the point.
	 */
	HeatMap.prototype.processPoint = function (target, point, colors) {
		// Obtain the magnitude of the point.
		var magnitude = point[2];
		// Create the geometry and compute its bounding box.
		var geometry = this.createGeometry(magnitude);
		geometry.computeBoundingBox();
		// Create the shader material with the specified uniforms and shaders.
		var material = new THREE.ShaderMaterial({
			uniforms: {
				uMin: {type: 'f', value: 0},
				uMax: {type: 'f', value: 25},
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
		mesh.position.set(position[0], position[1], position[2]);
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
		return new THREE.BoxGeometry(transform[0], transform[1], transform[2]);
	};

	return HeatMap;

});
