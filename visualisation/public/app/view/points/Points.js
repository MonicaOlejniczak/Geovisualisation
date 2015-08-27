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

		THREE.Mesh.call(this);

		// Ensure the options exist.
		options = options || {};

		this._points = [];

		// Initalise the global min and max values.
		this._min = this._max = 0;

		// Set the width and height of the points.
		this.width = options.width || 1;
		this.height = options.height || 1;

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
		this.shaderPath = options.shaderPath || 'data/hybrid/Hybrid';

	}

	Points.prototype = Object.create(THREE.Mesh.prototype);
	Points.prototype.constructor = Points;

	/**
	 * An accessor method that returns the list of points.
	 *
	 * @returns {Array}
	 */
	Points.prototype.getPoints = function () {
		return this.children;
	};

	/**
	 * An accessor method that returns the global minimum value of all points.
	 *
	 * @returns {number|*}
	 */
	Points.prototype.getMin = function () {
		return this._min;
	};

	/**
	 * An accessor method that returns the global maximum value of all points.
	 *
	 * @returns {number|*}
	 */
	Points.prototype.getMax = function () {
		return this._max;
	};

	/**
	 * Gets the options for the point.
	 *
	 * @returns {{mode: *, colors: *, bound: THREE.Vector2, colorRange: *}}
	 */
	Points.prototype.getOptions = function () {
		return {
			mode: this.mode,
			colors: this.colors,
			bound: new THREE.Vector2(this.getMin(), this.getMax()),
			colorRange: this.colorRange.range
		};
	};

	/**
	 * Adds a list of points to the class and then updates the uniforms.
	 *
	 * @param points The array of points to add.
	 * @param projection The projection instance.
	 */
	Points.prototype.addPoints = function (points, projection) {
		points.forEach(function (point) {
			this.addPoint(point, projection);
		}, this);
		this.update();
	};

	/**
	 * Adds a point to the list and calculate the new max value.
	 *
	 * @param data The point data used to create the point.
	 * @param [projection] The point projection instance.
	 * @returns {Point}
	 */
	Points.prototype.addPoint = function (data, projection) {
		// Create the point and adjust the min and max value of the points.
		var point = new Point(data, this.width, this.height, projection);
		this._max = Math.max(this.getMax(), point.max);
		// Add the point to the list.
		this._points.push(point);
		return point;
	};

	/**
	 * Updates each point with the correct material.
	 */
	Points.prototype.update = function () {
		// Load the shader before updating the points.
		new Shader(this.shaderPath).load().then(function (shader) {
			this._updatePoints(shader.material);
		}.bind(this));
	};

	/**
	 * Updates the points given a parent mesh, projection and material.
	 *
	 * @param material The updated material for the point.
	 * @private
	 */
	Points.prototype._updatePoints = function (material) {
		var points = this._points;
		var options = this.getOptions();
		for (var i = 0, len = points.length; i < len; i++) {
			var point = this._updatePoint(points[i], material, options);
			this.add(point);
		}
	};

	/**
	 * Updates the point given its projection, material and options.
	 *
	 * @param point The point being updated.
	 * @param material The updated material for the point.
	 * @param options The material options for the shader.
	 * @returns {Point}
	 * @private
	 */
	Points.prototype._updatePoint = function (point, material, options) {
		options = options || {};
		point.updateMaterial(material, options.mode, options.colors, options.bound, options.colorRange);
		return point;
	};

	return Points;

});
