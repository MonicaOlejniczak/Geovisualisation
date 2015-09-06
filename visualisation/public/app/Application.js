define(function (require) {

	'use strict';

	var $ = require('jquery');

	var Points = require('collection/Points');
	var Data = require('util/Data');

	var FlatHeatMap = require('component/visualisation/FlatHeatMap');
	var RoundHeatMap = require('component/visualisation/RoundHeatMap');

	var Information = require('view/information/Information');
	var Filter = require('view/Filter');
	var Gui = require('view/Gui');

	function Application () {
		this.$canvas = $('#visualisation');
		// Load the data from the test file and render the scene.
		Data.load('app/data/generate.js', this.processData.bind(this));
	}

	Application.prototype.processData = function (data) {
		var points = new Points(data);
		var visualisation = new FlatHeatMap(this.$canvas, points);
		var information = new Information(visualisation.renderer, visualisation.points);
		var filter = new Filter(visualisation.points.collection);
		var gui = new Gui(visualisation);
	};

	return Application;

});