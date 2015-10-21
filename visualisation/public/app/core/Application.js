/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');

	var Viewport = require('core/Viewport');

	var Points = require('collection/Points');
	var Point = require('model/Point');

	var Convert = require('util/Convert');

	var PopulationData = require('json!data/population.json');
	//var PopulationData = require('json!data/population_google.json');
	var StudentData = require('json!data/students.json');

	var FlatHeatMap = require('component/visualisation/FlatHeatMap');
	var RoundHeatMap = require('component/visualisation/RoundHeatMap');
	var GridHeatMap = require('component/visualisation/GridHeatMap');

	var Information = require('component/information/Information');
	var Filters = require('component/filters/Filters');
	var Gui = require('component/Gui');

	/**
	 * Instantiates the application.
	 *
	 * @param $canvas
	 * @constructor
	 */
	function Application ($canvas) {

		// TODO hack
		window.app = this;

		this.$canvas = $canvas;
		this.viewport = new Viewport($('#content'));

		var data = PopulationData;
		// Longitude = azimuthal angle, latitude = elevation.
		var keys = new THREE.Vector3('longitude', 'latitude', 'population');
		var collection = this.processData(data, keys);

		//var data = StudentData;
		//var keys = new THREE.Vector3('group', 'week', 'progress');
		//var collection = this.processGridData(data, keys);

		this.visualisation = new FlatHeatMap($canvas, collection);
		//this.visualisation = new RoundHeatMap($canvas, collection);
		//this.visualisation = new GridHeatMap($canvas, collection);

		var renderer = this.visualisation.renderer;
		var points = this.visualisation.points;
		var filters = ['magnitude', 'timezone'];

		new Information(renderer, points, filters);
		new Filters(collection, keys, filters);
		new Gui(this.visualisation);

		renderer.render();

	}

	/**
	 * Generates random data with the generate function.
	 *
	 * @param generate The generate function.
	 */
	Application.prototype.generateData = function (generate) {
		// Set up the bounds for the data.
		var x = new THREE.Vector2(-200, 200);
		var y = new THREE.Vector2(-100, 100);
		var z = new THREE.Vector2(0, 50);
		var bound = new THREE.Vector3(x, y, z);
		// Generate the data and then process it.
		var data = generate.call(this, 100, bound);
		var points = this.processData(data, new THREE.Vector3('x', 'y', 'z'));
		//return this.processPoints(points);
	};

	/**
	 * Processes the specified data.
	 *
	 * @param data The list of points data being processed.
	 * @param keys The keys within the point data that refer to the x, y and z values of the point.
	 * @returns {*}
	 */
	Application.prototype.processData = function (data, keys) {
		var points = [];
		console.log(data.length);
		for (var i = 0, len = Math.min(data.length, 5000); i < len; i++) {
			points.push(this.createPoint(data[i], keys));
		}
		return new Points(points);
	};

	/**
	 * Processes grid data.
	 *
	 * @param data The list of points data being processed.
	 * @param keys The keys within the point data that refer to the x, y and z values of the point.
	 * @returns {*}
	 */
	Application.prototype.processGridData = function (data, keys) {
		var points = [];
		var map = {x: {}, z: {}};
		for (var i = 0, len = Math.min(data.length, 1000); i < len; i++) {
			points.push(this.createGridPoint(data[i], keys, map));
		}
		return new Points(points);
	};

	/**
	 * Creates a point by processing its position and adding additional properties such as the coordinate and magnitude
	 * to standardise filtering and position retrieval.
	 *
	 * @param point The point data.
	 * @param keys The keys within the point data that refer to the x, y and z values of the point.
	 * @returns {*}
	 */
	Application.prototype.createPoint = function (point, keys) {

		// Store the point properties.
		var properties = point;
		// Get the position of the point by transforming the values
		var position = Convert.transform(new THREE.Vector3(properties[keys.x], properties[keys.y], properties[keys.z]));

		// Add keys for the coordinate and magnitude of the point.
		properties['coordinate'] = new THREE.Vector2(position.x, position.z);
		properties['magnitude'] = position.y;

		return new Point(properties);

	};

	/**
	 * Creates a point by calculating its position based on how many existing values exist in the map for that property.
	 *
	 * @param map The map of x and z values.
	 * @param point The point data.
	 * @param keys The keys within the point data that refer to the x, y and z values of the point.
	 * @returns {*}
	 */
	Application.prototype.createGridPoint = function (point, keys, map) {
		var properties = point;

		properties[keys.z] = properties[keys.z] * 100;

		// Get the position of the point by transforming the values
		var position = Convert.transform(new THREE.Vector3(properties[keys.x], properties[keys.y], properties[keys.z]));

		var xValue = map.x[position.x] = map.x[position.x] || [];
		var zValue = map.z[position.z] = map.z[position.z] || [];

		xValue.push(properties);
		zValue.push(properties);

		var distance = 10;
		properties['coordinate'] = new THREE.Vector2((xValue.length - 1) * distance, (zValue.length - 1) * distance);
		properties['magnitude'] = position.y;

		return new Point(properties);
	};

	return Application;

});