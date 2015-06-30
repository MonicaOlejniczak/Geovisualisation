/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Visualisation = require('view/Visualisation');
	var LightHelper = require('helper/Light');
	var Color = require('util/Color');
	var GradientShader = require('shader/Gradient');

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
		// Set the width and height of the geometry.
		this.width = this.height = 1;
		this.vertexShader = GradientShader.vertex;
		this.fragmentShader = GradientShader.fragment;
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
		// Iterates through each point.
		for (var i = 0, len = data.length; i < len; i++) {
			// Processes the current point in the data.
			points.add(this.processPoint(target, data[i]));
		}
		scene.add(points);
	};

	/**
	 * Processes the point data.
	 *
	 * @param target The target position for the point to look at.
	 * @param point The point being processed.
	 */
	HeatMap.prototype.processPoint = function (target, point) {
		// Obtain the magnitude of the point.
		var magnitude = point[2];
		// Create the geometry and material.
		var geometry = this.createGeometry(magnitude);

		var material = new THREE.ShaderMaterial({
			uniforms: {
				uMin: {type: 'f', value: 0},
				uMax: {type: 'f', value: 50},
				uMagnitude: {type: 'f', value: magnitude},
				uTopColor: {type: 'c', value: new THREE.Color(0xff0000)},
				uMiddleColor: {type: 'c', value: new THREE.Color(0xff00ff)},
				uBottomColor: {type: 'c', value: new THREE.Color(0x00ff00)}
			},
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader
		});
		// Transform the position into the correct coordinates and create the mesh.
		var position = this.transform(point[0], point[1], magnitude);
		var mesh = new THREE.Mesh(geometry, material);
		// Rotate the mesh so it is looking at the target vector.
		mesh.lookAt(target);
		//mesh.rotateX(Math.PI * 0.5);
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

	HeatMap.prototype.applyVertices = function (geometry) {
		var faces = geometry.faces;
		for (var i = 0, len = faces.length; i < len; i++) {
			var face = faces[i];
			for (var j = 0; j < 3; j++) {
				face.vertexColors[j] = new THREE.Color(0xffff00);
			}
		}
		geometry.colorsNeedUpdate = true;
	};

	return HeatMap;

});
