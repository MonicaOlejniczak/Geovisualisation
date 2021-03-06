/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var Point = require('component/points/point/Point');

	var Shader = require('helper/Shader');

	/**
	 * Initialises the points.
	 *
	 * @param collection The points collection.
	 * @param options
	 * @constructor
	 */
	function Points (collection, options) {

		THREE.Mesh.call(this);

		this.collection = collection;

		// Ensure the options exist.
		options = options || {};

		// Initialise the global min and max values.
		var property = 'magnitude';
		this.min = Math.max(0, this.collection.min(function (model) {return model.get(property)}).get(property));
		this.max = this.collection.max(function (model) {return model.get(property)}).get(property);

		// Set the width and height of the points.
		this.width = options.width || 0.75;
		this.height = options.height || 0.75;

		// Set the min and max HSV colour range.
		this.colorRange = {
			bound: new THREE.Vector2(0, 1),
			range: new THREE.Vector2(0.15, 0.8)
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
		this.alpha = 1;

		// Set the shader path.
		this.shaderPath = options.shaderPath || 'data/hybrid/Hybrid';

		this.addPoints(collection);

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
		return this.min;
	};

	/**
	 * An accessor method that returns the global maximum value of all points.
	 *
	 * @returns {number|*}
	 */
	Points.prototype.getMax = function () {
		return this.max;
	};

	/**
	 * Gets the options for the point.
	 *
	 * @returns {{mode: *, colors: *, bound: THREE.Vector2, colorRange: *}}
	 */
	Points.prototype.getOptions = function () {
		return {
			mode: this.mode,
			alpha: this.alpha,
			colors: this.colors,
			bound: new THREE.Vector2(this.getMin(), this.getMax()),
			colorRange: this.colorRange.range
		};
	};

	/**
	 * Adds a list of points to the class and then updates the uniforms.
	 *
	 * @param points The array of points to add.
	 */
	Points.prototype.addPoints = function (points) {
		points.each(function (point) {
			this.addPoint(point);
		}, this);
		this.update();
	};

	/**
	 * Adds a point to the mesh and calculate the new max value.
	 *
	 * @param model The point model.
	 * @returns {Point}
	 */
	Points.prototype.addPoint = function (model) {
		var point = new Point(model, this.width, this.height, this.max);
		this.add(point);
		return point;
	};

	/**
	 * Updates each point with the correct material.
	 */
	Points.prototype.update = function () {
		// Load the shader before updating the points.
		new Shader(this.shaderPath).load().then(function (shader) {
			this.updatePoints(shader.material);
		}.bind(this));
	};

	/**
	 * Updates the points given a parent mesh, projection and material.
	 *
	 * @param material The updated material for the point.
	 */
	Points.prototype.updatePoints = function (material) {
		var points = this.getPoints();
		var options = this.getOptions();
		for (var i = 0, len = points.length; i < len; i++) {
			this.updatePoint(points[i], material, options);
		}
	};

	/**
	 * Updates the point given its projection, material and options.
	 *
	 * @param point The point being updated.
	 * @param material The updated material for the point.
	 * @param options The material options for the shader.
	 * @returns {Point}
	 */
	Points.prototype.updatePoint = function (point, material, options) {
		options = options || {};
		point.updateMaterial(material, options.mode, options.alpha, options.colors, options.colorRange);
		return point;
	};

	return Points;

});
