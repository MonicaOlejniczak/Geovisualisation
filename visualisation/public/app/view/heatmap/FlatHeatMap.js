/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var HeatMap = require('view/heatmap/HeatMap');
	var FlatSurface = require('view/surface/FlatSurface');
	var Projection = require('util/Projection');

	/**
	 * Initialises the heat map with the flat surface.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	function FlatHeatMap (canvas) {
		var surface = new FlatSurface();
		var projection = new Projection(Projection.standard, {offset: surface.height});
		HeatMap.call(this, canvas, surface, projection, {
			camera: {position: new THREE.Vector3(0, 100, 200)},
			mouseControls: true
		});
	}

	FlatHeatMap.prototype = Object.create(HeatMap.prototype);
	FlatHeatMap.prototype.constructor = FlatHeatMap;

	return FlatHeatMap;

});
