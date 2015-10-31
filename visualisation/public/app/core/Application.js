/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');
	//var Stats = require('stats');

	var Viewport = require('core/Viewport');
	var MouseControls = require('controls/Mouse');

	var Points = require('collection/Points');
	var Point = require('model/Point');

	var Convert = require('util/Convert');

	var PopulationData = require('json!data/population.json');
	//var PopulationData = require('json!data/population_google.json');
	//var StudentData = require('json!data/students.json');

	var FlatHeatMap = require('component/visualisation/FlatHeatMap');
	var RoundHeatMap = require('component/visualisation/RoundHeatMap');
	var GridHeatMap = require('component/visualisation/GridHeatMap');

	var Raycaster = require('core/Raycaster');
	var Help = require('component/help/Help');
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

		this.$content = $('#content');

		this.$canvas = $canvas;
		this.viewport = new Viewport(this.$content);

		this.renderer = new THREE.WebGLRenderer({
			canvas: $canvas.get(0),
			alpha: true,
			antialias: true
		});

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, $canvas.width() / $canvas.height(), 0.1, 5000);
		this.controls = new MouseControls(this.camera, $canvas.get(0));

		this.camera.lookAt(this.scene.position);
		this.renderer.setSize($canvas.width(), $canvas.height());

		//this.addStats();

	}

	Application.prototype.addStats = function () {
		this.stats = new Stats();
		this.stats.setMode(0);

		var $stats = $(this.stats.domElement);

		$stats.css({
			position: 'absolute',
			right: 0,
			top: 0
		});

		this.$content.append($stats);
	};

	Application.prototype.loadCuboid = function () {
		var keys = new THREE.Vector3('longitude', 'latitude', 'population');
		var collection = this.processData(PopulationData, keys);
		var visualisation = new FlatHeatMap(collection);

		this.camera.position.set(0, 200, 175);
		this.camera.rotateX(-Math.PI / 4);

		this.$content.append(new Help({model: new Backbone.Model({color: 'white'})}).$el);
		this.run(collection, keys, visualisation);

		this.scene.add(visualisation);

		return visualisation;
	};

	Application.prototype.loadGlobe = function () {
		var keys = new THREE.Vector3('longitude', 'latitude', 'population');
		var collection = this.processData(PopulationData, keys);
		var visualisation = new RoundHeatMap(collection);

		this.camera.position.set(0, 10, 350);

		this.$content.append(new Help({model: new Backbone.Model({color: 'white'})}).$el);
		this.run(collection, keys, visualisation);
		this.scene.add(visualisation);
		return visualisation;
	};

	Application.prototype.loadGrid = function () {
		var keys = new THREE.Vector3('group', 'week', 'progress');
		var collection = this.processGridData(StudentData, keys);
		var visualisation = new GridHeatMap(collection);

		this.camera.position.set(0, 0, 500);
		this.controls.panCamera(new THREE.Vector2(0, 100));

		this.$content.append(new Help({model: new Backbone.Model({color: 'black'})}).$el);
		this.run(collection, keys, visualisation);
		this.scene.add(visualisation);
		return visualisation;
	};

	Application.prototype.run = function (collection, keys, visualisation) {
		var points = visualisation.points;
		var filters = ['coordinate', 'magnitude', 'timezone'];

		this.raycaster = new Raycaster(this.$canvas.get(0), this.camera, points);

		new Information(this.raycaster, filters);
		new Filters(collection, keys, filters);
		new Gui(visualisation);

	};

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
		var size = Math.min(data.length, 1000);
		//var size = data.length;
		console.log(size);
		for (var i = 0, len = size; i < len; i++) {
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
		//var size = Math.min(data.length, 20000);
		var size = data.length;
		console.log(size);
		for (var i = 0, len = size; i < len; i++) {
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

	/**
	 * A method called on each render that checks if a resize needs to be applied.
	 */
	Application.prototype.resize = function () {
		// Retrieve the canvas and the camera.
		var viewport = this.viewport;
		var $canvas = this.$canvas;
		// Lookup the size the browser is displaying the canvas.
		var width = viewport.width();
		var height = viewport.height();
		// Check if a resize needs to be applied.
		if ($canvas.width() !== width || $canvas.height() !== height) {
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(width, height);
		}
	};

	/**
	 * The rendering function that updates the canvas.
	 */
	Application.prototype.render = function () {
		requestAnimationFrame(this.render.bind(this));
		//this.stats.begin();
		this.resize();
		if (this.raycaster) {
			this.raycaster.update();
		}
		this.renderer.render(this.scene, this.camera);
		//this.stats.end();
	};

	return Application;

});