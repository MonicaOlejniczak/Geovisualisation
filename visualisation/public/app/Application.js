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

	function Application () {
		this.$canvas = $('#visualisation');
		// Initialise the data with the specified path and then load the file.
		var data = new Data('data/generate');
		data.load().then(this.generateData.bind(this));
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
		var points = this.processData(data);
		this.processPoints(points);
	};

	/**
	 * Processes the specified data by transforming a point model and storing it in a list so it can form a collection.
	 *
	 * @param data The point data being processed.
	 * @returns {Array}
	 */
	Application.prototype.processData = function (data) {
		var points = [];
		// Iterate through all the data.
		data.forEach(function (point) {
			// Convert the position
			var position = Convert.transform(new THREE.Vector3(point.x, point.y, point.z));
			points.push(new Point({
				coordinate: new THREE.Vector2(position.x, position.z),
				magnitude: position.y
			}));
		});
		return points;
	};

	/**
	 * Processes the points and sets up the visualisation.
	 *
	 * @param data The processed points.
	 */
	Application.prototype.processPoints = function (data) {
		var points = new Points(data);
		var visualisation = new FlatHeatMap(this.$canvas, points);
		var information = new Information(visualisation.renderer, visualisation.points);
		var filter = new Filter(visualisation.points.collection);
		var gui = new Gui(visualisation);
	};

	return Application;

});