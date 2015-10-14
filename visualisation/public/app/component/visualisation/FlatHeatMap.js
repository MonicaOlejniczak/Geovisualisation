/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var Visualisation = require('component/visualisation/Visualisation');
	var FlatSurface = require('component/surface/FlatSurface');
	var Projection = require('util/Projection');

	/**
	 * Initialises the heat map with the flat surface.
	 *
	 * @param canvas The HTML canvas.
	 * @param points The points collection.
	 * @constructor
	 */
	function FlatHeatMap (canvas, points) {
		var surface = new FlatSurface();
		var projection = new Projection(Projection.standard, {
			offset: surface.height,
			bounds: new THREE.Vector2(
				new THREE.Vector2(new THREE.Vector2(-180, 180), new THREE.Vector2(-surface.width * 0.5, surface.width * 0.5)),
				new THREE.Vector2(new THREE.Vector2(-90, 90), new THREE.Vector2(-surface.depth * 0.5, surface.depth * 0.5))
			)
		});
		Visualisation.call(this, canvas, points, projection, surface, {
			camera: {position: new THREE.Vector3(0, 100, 200)},
			mouseControls: true
		});
	}

	FlatHeatMap.prototype = Object.create(Visualisation.prototype);
	FlatHeatMap.prototype.constructor = FlatHeatMap;

	return FlatHeatMap;

});
