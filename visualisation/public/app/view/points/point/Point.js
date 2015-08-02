/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Convert = require('util/Convert');

	/**
	 * Initialises the point.
	 *
	 * @param point The point data.
	 * @param width The width of the point.
	 * @param height The height of the point.
	 * @constructor
	 */
	function Point (point, width, height) {
		// Set the transformed position data.
		var position = this.position = Convert.transform(point[0], point[1], point[2]);

		// Set the width, height and the magnitude of the point.
		this.width = width;
		this.height = height;
		this.magnitude = position.y;

		// Create the geometry and compute its bounding box.
		var transform = Convert.transform(this.width, this.height, this.magnitude);
		var geometry = new THREE.BoxGeometry(transform.x, transform.y, transform.z);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.magnitude * 0.5, 0));
		geometry.computeBoundingBox();

		// Obtain the bounding box of the geometry and set the min and max values.
		var boundingBox = geometry.boundingBox;

		this.min = boundingBox.min.y;
		this.max = boundingBox.max.y;

		// Set the colors to be used with the points.
		this.colors = {
			low: new THREE.Color(0xffe900),
			medium: new THREE.Color(0xff8c00),
			high: new THREE.Color(0xb51212)
		};

		// Set the mesh.
		this.mesh = new THREE.Mesh(geometry, new THREE.Material());
	}

	Point.prototype.constructor = Point;

	/**
	 * Updates the material and the associated uniforms of the point;
	 *
	 * @param material The new material for the point.
	 * @param colors The colours used with the material.
	 * @param min The global min value of all points.
	 * @param max The global max value of all points.
	 */
	Point.prototype.updateMaterial = function (material, colors, min, max) {
		// Obtain the mesh and update its material.
		var mesh = this.mesh;
		mesh.material = material;
		// Update the uniforms of the material.
		mesh.material.uniforms = {
			uMin: {type: 'f', value: min},
			uMax: {type: 'f', value: max},
			// Basic shader uniforms.
			uMagnitude: {type: 'f', value: this.magnitude},
			uMinRange: {type: 'f', value: 0.15},
			uMaxRange: {type: 'f', value: 0.5},
			uSaturation: {type: 'f', value: 1.0},
			uLightness: {type: 'f', value: 1.0},
			// Gradient shader uniforms.
			uLowColor: {type: 'c', value: colors.low},
			uMediumColor: {type: 'c', value: colors.medium},
			uHighColor: {type: 'c', value: colors.high}
		};
	};

	/**
	 * This method updates the position of the point by rotating the mesh to look at the target vector. It then sets
	 * the position and y-position of the mesh so that it is above the offset.
	 *
	 * @param target The target vector to look at.
	 * @param [projection] The projection callback function.
	 */
	Point.prototype.updatePosition = function (target, projection) {
		var point = this.mesh;
		var position = this.position;

		point.position.set(position.x, position.y, position.z);
		if (projection) {
			projection.project.call(projection, point, target);
		}

	};

	return Point;

});
