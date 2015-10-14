/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var Visualisation = require('component/visualisation/Visualisation');
	var Projection = require('util/Projection');

	/**
	 * Initialises the heat map with the grid surface.
	 *
	 * @param canvas The HTML canvas.
	 * @param points The points collection.
	 * @constructor
	 */
	function GridHeatMap (canvas, points) {
		var maxX = points.max(function (model) {return model.get('coordinate').x}).get('coordinate').x;
		var maxZ = points.max(function (model) {return model.get('coordinate').y}).get('coordinate').y;

		var offset = 20;
		var width = maxX + (offset * 2);
		var height = 3;
		var depth = maxZ + (offset * 2);

		var surface = this.createSurface(width, height, depth);
		var projection = new Projection(Projection.standard, {
			offset: height,
			bounds: new THREE.Vector2(
				new THREE.Vector2(new THREE.Vector2(-maxX, maxX), new THREE.Vector2(-maxX, maxX)),
				new THREE.Vector2(new THREE.Vector2(-maxZ, maxZ), new THREE.Vector2(-maxZ, maxZ))
			)
		});
		Visualisation.call(this, canvas, points, projection, surface, {
			camera: {position: new THREE.Vector3(0, 100, 200)},
			mouseControls: true,
			skybox: false,
			width: 5,
			height: 5
		});

		this.points.translateX((-width * 0.5) + offset);
		this.points.translateZ((depth * 0.5) - offset);

	}

	GridHeatMap.prototype = Object.create(Visualisation.prototype);
	GridHeatMap.prototype.constructor = GridHeatMap;

	GridHeatMap.prototype.createSurface = function (width, height, depth) {
		var geometry = new THREE.BoxGeometry(width, height, depth);
		var material = new THREE.MeshBasicMaterial({
			color: new THREE.Color(0xdddddd)
		});
		var surface = new THREE.Mesh(geometry, material);
		surface.position.setY(height * 0.5);
		return surface;
	};

	return GridHeatMap;

});
