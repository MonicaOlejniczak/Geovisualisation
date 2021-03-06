/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var Visualisation = require('component/visualisation/Visualisation');
	var RoundSurface = require('component/surface/RoundSurface');
	var Projection = require('core/Projection');

	/**
	 * Initialises the heat map with the round surface.
	 *
	 * @param points The points collection.
	 * @constructor
	 */
	function RoundHeatMap (points) {

		var surface = new RoundSurface(100);
		var projection = new Projection(Projection.spherical, {
			radius: surface.radius,
			bounds: new THREE.Vector2(
				new THREE.Vector2(new THREE.Vector2(-180, 180), new THREE.Vector2(0, 360)), // theta
				new THREE.Vector2(new THREE.Vector2(-90, 90), new THREE.Vector2(0, 180)) // phi
			)
		});

		Visualisation.call(this, points, projection, surface);

	}

	RoundHeatMap.prototype = Object.create(Visualisation.prototype);
	RoundHeatMap.prototype.constructor = RoundHeatMap;

	return RoundHeatMap;

});
