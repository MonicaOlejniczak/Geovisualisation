/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var Visualisation = require('component/visualisation/Visualisation');
	var RoundSurface = require('component/surface/RoundSurface');
	var Projection = require('util/Projection');

	/**
	 * Initialises the heat map with the round surface.
	 *
	 * @param canvas The HTML canvas.
	 * @param points The points collection.
	 * @constructor
	 */
	function RoundHeatMap (canvas, points) {

		var surface = new RoundSurface(100);
		var projection = new Projection(Projection.spherical, {
			radius: surface.radius,
			thetaBound: new THREE.Vector2(-180, 180),
			phiBound: new THREE.Vector2(-90, 90)
		});

		Visualisation.call(this, canvas, points, projection, surface, {
			camera: {position: new THREE.Vector3(0, 100, 300)},
			mouseControls: true
		});

	}

	RoundHeatMap.prototype = Object.create(Visualisation.prototype);
	RoundHeatMap.prototype.constructor = RoundHeatMap;

	return RoundHeatMap;

});