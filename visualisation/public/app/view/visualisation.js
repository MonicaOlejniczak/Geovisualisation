/**
 * @author Monica Olejniczak
 */
define(['jquery', 'threejs', 'Canvas', 'util/Color'], function ($, THREE, Canvas, Color) {

	'use strict';

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	var Visualisation = function (canvas) {
		Canvas.call(this, canvas.get(0), {
			cameraPosition: new THREE.Vector3(0, 0, 50),
			controls: true
		});
		this.readData();
		// Create the elements in the scene
		this.createScene(this.scene);
		this.render();
	};

	Visualisation.prototype = Object.create(Canvas.prototype);
	Visualisation.prototype.constructor = Visualisation;

	Visualisation.prototype.readData = function () {
		$.getJSON('app/data/test.json', function (data) {
			for (var i = 0, len = data.length; i < len; i++) {
				this.addSeries(data[i]);
			}
		}.bind(this));
	};

	Visualisation.prototype.addSeries = function (series) {
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({
			color: Color.generate()
		});
		for (var i = 0, len = series.length; i < len; i++) {
			var point = series[i];
			geometry.vertices.push(new THREE.Vector3(point[0], point[1], 0));
		}
		var line = new THREE.Line(geometry, material);
		this.scene.add(line);
	};

	/**
	 * This method creates all the components inside the canvas and adds it to the scene.
	 *
	 * @param scene The scene object.
	 */
	Visualisation.prototype.createScene = function (scene) {
		/*var geometry = new THREE.BoxGeometry(50, 50, 50);
		var material = new THREE.MeshBasicMaterial();
		var mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);*/
	};

	return Visualisation;

});
