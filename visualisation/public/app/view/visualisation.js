/**
 * @author Monica Olejniczak
 */
define(['threejs', 'canvas'], function (THREE, Canvas) {

	'use strict';

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	var Visualisation = function (canvas) {
		Canvas.call(this, canvas.get(0), {
			cameraPosition: new THREE.Vector3(0, 0, 75)
		});
		// Create the elements in the scene
		this.createScene(this.scene);
		this.render();
	};

	Visualisation.prototype = Object.create(Canvas.prototype);
	Visualisation.prototype.constructor = Visualisation;

	/**
	 * This method creates all the components inside the canvas and adds it to the scene.
	 *
	 * @param scene The scene object.
	 */
	Visualisation.prototype.createScene = function (scene) {
		var geometry = new THREE.BoxGeometry(50, 50, 50);
		var material = new THREE.MeshBasicMaterial();
		var mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	};

	return Visualisation;

});
