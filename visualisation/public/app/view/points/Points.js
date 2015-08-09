/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Point = require('view/points/point/Point');
	var Shader = require('helper/Shader');

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
		this._width = options.width || 1;
		this._height = options.height || 1;

		// Set the min and max HSV colour range.
		this.colorRange = {
			bound: new THREE.Vector2(0, 1),
			range: new THREE.Vector2(0.15, 0.6)
		};

		// Set the colors to be used with the points.
		this.colors = {
			low: new THREE.Color(0xffe900),
			medium: new THREE.Color(0xff8c00),
			high: new THREE.Color(0xb51212)
		};

		this.Mode = {
			BASIC: 0,
			GRADIENT: 1
		};
		this.mode = this.Mode.BASIC;

		// Set the shader path.
		this._shaderPath = options.shaderPath || 'data/hybrid/Hybrid';

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
	 * @param [projection] The projection function for the point.
	 * @returns {THREE.Mesh}
	 */
	Points.prototype.update = function (target, projection) {
		var parent = new THREE.Mesh();
		var points = this._points;
		var mode = this.mode;
		var colors = this.colors;
		var bound = new THREE.Vector2(this._min, this._max);
		var colorRange = this.colorRange.range;
		// Load the shader before iterating through each point.
		new Shader(this._shaderPath).then(function (material) {
			// Iterate through each point.
			for (var i = 0, len = points.length; i < len; i++) {
				var point = points[i];
				// Update the material and position of the point.
				point.updateMaterial(material, mode, colors, bound, colorRange);
				point.updatePosition(target, projection);
				// Add the point to the parent mesh.
				parent.add(point.mesh);
			}
		}.bind(this));
		return parent;
	};

	return Points;

});
