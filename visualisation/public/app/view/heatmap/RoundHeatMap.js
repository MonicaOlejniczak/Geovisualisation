/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var HeatMap = require('view/heatmap/HeatMap');
	var RoundSurface = require('view/surface/RoundSurface');
	var Projection = require('util/Projection');

	/**
	 * Initialises the heat map with the round surface.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	function RoundHeatMap (canvas) {
		var surface = new RoundSurface();
		var projection = new Projection(Projection.spherical, {radius: surface.radius});
		HeatMap.call(this, canvas, surface, projection, {
			camera: {position: new THREE.Vector3(0, 100, 800)},
			mouseControls: true
		});
	}

	RoundHeatMap.prototype = Object.create(HeatMap.prototype);
	RoundHeatMap.prototype.constructor = RoundHeatMap;

	return RoundHeatMap;

});
