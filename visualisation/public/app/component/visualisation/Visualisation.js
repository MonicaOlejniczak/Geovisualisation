/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	var Skybox = require('component/skybox/Skybox');
	var Points = require('component/points/Points');

	/**
	 * Initialises the visualisation.
	 *
	 * @param points The points collection.
	 * @param projection The projection to be used with each data point.
	 * @param surface The surface of the heat map.
	 * @param options The options for the renderer.
	 * @constructor
	 */
	function Visualisation (points, projection, surface, options) {

		THREE.Mesh.call(this);

		options = options || {};

		projection = projection || function () {};
		projection.target = this.position;

		this.points = new Points(points, projection, options);

		this.points.children.forEach(function (point) {
			projection.project.call(projection, point);
		});

		this.surface = surface;

		if (options.skybox !== false) {
			this.skybox = new Skybox();
			this.add(this.skybox);
		}

		this.add(this.surface);
		this.add(this.points);

	}

	Visualisation.prototype = Object.create(THREE.Mesh.prototype);
	Visualisation.prototype.constructor = Visualisation;

	return Visualisation;

});
