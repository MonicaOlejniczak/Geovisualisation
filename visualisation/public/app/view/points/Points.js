/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Point = require('view/points/point/Point');
	var Shader = require('util/Shader');

	/**
	 * Initialises the points.
	 *
	 * @constructor
	 */
	function Points (options) {

		// Ensure the options exist.
		options = options || {};

		// Initalise the list of points and the global min and max values.
		this._points = [];
		this._min = this._max = 0;

		// Set the width and height of the points.
		this._width = options.width || 0.5;
		this._height = options.height || 0.5;

		// Set the colors to be used with the points.
		this._colors = {
			low: new THREE.Color(0xffe900),
			medium: new THREE.Color(0xff8c00),
			high: new THREE.Color(0xb51212)
		};

		// Set the shader path.
		this._shaderPath = options.shaderPath || 'gradient/Gradient';

	}

	Points.prototype.constructor = Points;

	/**
	 * Adds a point to the list and calculate the new max value.
	 *
	 * @param data The point data used to create the point.
	 * @returns {THREE.Mesh}
	 */
	Points.prototype.addPoint = function (data) {
		// Create the point and adjust the max value of the points.
		var point = new Point(data, this._width, this._height);
		this._max = Math.max(this._max, point.max);
		// Add the point to the list.
		this._points.push(point);
		return point;
	};

	/**
	 * Updates each point with the correct material and position.
	 *
	 * @param target The target vector for the point to look at.
	 * @param offset The offset y-position value for the point.
	 * @returns {THREE.Mesh}
	 */
	Points.prototype.update = function (target, offset) {
		var parent = new THREE.Mesh();
		var points = this._points;
		var colors = this._colors;
		var min = this._min;
		var max = this._max;
		// Load the shader before iterating through each point.
		new Shader(this._shaderPath).then(function (material) {
			// Iterate through each point.
			for (var i = 0, len = points.length; i < len; i++) {
				var point = points[i];
				// Update the material and position of the point.
				point.updateMaterial(material, colors, min, max);
				point.updatePosition(target, offset);
				// Add the point to the parent mesh.
				parent.add(point.mesh);
			}
		}.bind(this));
		return parent;
	};

	return Points;

});
