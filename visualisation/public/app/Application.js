/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');

	var Points = require('collection/Points');
	var Point = require('model/Point');

	var Convert = require('util/Convert');
	var Data = require('util/Data');

	var FlatHeatMap = require('component/visualisation/FlatHeatMap');
	var RoundHeatMap = require('component/visualisation/RoundHeatMap');

	var Information = require('view/information/Information');
	var Filter = require('view/Filter');
	var Gui = require('view/Gui');

	/**
	 * Instantiates the application.
	 *
	 * @constructor
	 */
	function Application () {
		this.$canvas = $('#visualisation');
		// Initialise the data with the specified path and then load the file.
		//var data = new Data('data/generate');
		//data.load().then(this.generateData.bind(this));
		var data = new Data('json!data/population.json');
		data.load().then(this.processPopulationData.bind(this));
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
		var points = this.processData(data, 'x', 'y', 'z');
		this.processPoints(points);
	};

	/**
	 * Processes population data.
	 *
	 * @param data The population data.
	 */
	Application.prototype.processPopulationData = function (data) {
		// Longitude = azimuthal angle, latitude = elevation.
		this.processData(data, new THREE.Vector3('longitude', 'latitude', 'population'));
	};

	/**
	 * Processes the specified data.
	 *
	 * @param data The list of points data being processed.
	 * @param keys The keys within the point data that refer to the x, y and z values of the point.
	 */
	Application.prototype.processData = function (data, keys) {
		var points = [];
		for (var i = 0, len = Math.min(data.length, 1000); i < len; i++) {
			points.push(this.createPoint(data[i], keys));
		}
		var collection = new Points(points);
		this.processCollection(collection);
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
		var position = Convert.transform(new THREE.Vector3(point[keys.x], point[keys.y], point[keys.z]));

		// Add keys for the coordinate and magnitude of the point.
		properties['coordinate'] = new THREE.Vector2(position.x, position.z);
		properties['magnitude'] = position.y;

		return new Point(properties);

	};

	/**
	 * Processes the collection of points and sets up the visualisation.
	 *
	 * @param collection The processed points collection.
	 */
	Application.prototype.processCollection = function (collection) {
		var visualisation = new FlatHeatMap(this.$canvas, collection);
		//var visualisation = new RoundHeatMap(this.$canvas, points);

		var points = visualisation.points;
		var filters = ['coordinate', 'magnitude', 'timezone'];

		var information = new Information(visualisation.renderer, points, filters);
		var filter = new Filter(collection, filters);
		var gui = new Gui(visualisation);
	};

	return Application;

});