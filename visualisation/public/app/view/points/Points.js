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

	Points.prototype.constructor = Points;

	/**
	 * An accessor method that returns the list of points.
	 *
	 * @returns {Array}
	 */
	Points.prototype.getPoints = function () {
		return this._points;
	};

	/**
	 * An accessor method that return the minimum value in all the points.
	 *
	 * @returns {number|*}
	 */
	Points.prototype.getMin = function () {
		return this._min;
	};

	/**
	 * An accessor method that return the maximum value in all the points.
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
	 * Adds a point to the list and calculate the new max value.
	 *
	 * @param data The point data used to create the point.
	 * @returns {Point}
	 */
	Points.prototype.addPoint = function (data) {
		// Create the point and adjust the min and max value of the points.
		var point = new Point(data, this.width, this.height);
		this._max = Math.max(this.getMax(), point.max);
		// Add the point to the list.
		this.getPoints().push(point);
		return point;
	};

	/**
	 * Updates each point with the correct material and position.
	 *
	 * @param [projection] The projection function for the point.
	 * @returns {THREE.Mesh}
	 */
	Points.prototype.update = function (projection) {
		var parent = new THREE.Mesh();
		// Load the shader before updating the points.
		new Shader(this.shaderPath).load().then(function (shader) {
			this._updatePoints(parent, projection, shader.material);
		}.bind(this));
		return parent;
	};

	/**
	 * Updates the points given a parent mesh, projection and material.
	 *
	 * @param parent The parent mesh to add the points to.
	 * @param projection The projection that will be applied to the point.
	 * @param material The updated material for the point.
	 * @returns {Array}
	 * @private
	 */
	Points.prototype._updatePoints = function (parent, projection, material) {
		var points = this.getPoints();
		var options = this.getOptions();
		for (var i = 0, len = points.length; i < len; i++) {
			var point = this._updatePoint(points[i], projection, material, options);
			parent.add(point.mesh);
		}
		return points;
	};

	/**
	 * Updates the point given its projection, material and options.
	 *
	 * @param point The point being updated.
	 * @param projection The projection that will be applied to the point.
	 * @param material The updated material for the point.
	 * @param options The material options for the shader.
	 * @returns {Point}
	 * @private
	 */
	Points.prototype._updatePoint = function (point, projection, material, options) {
		options = options || {};
		point.updatePosition(projection);
		point.updateMaterial(material, options.mode, options.colors, options.bound, options.colorRange);
		return point;
	};

	return Points;

});
