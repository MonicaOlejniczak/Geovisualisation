/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');

	var Viewport = require('Viewport');

	/**
	 * Creates a raycaster.
	 *
	 * @param element The active element that will apply the raycast.
	 * @param camera The camera being used with the raycast.
	 * @param parent The parent object that contains children that will be intersected.
	 * @constructor
	 */
	function Raycaster (element, camera, parent) {
		this.raycaster = new THREE.Raycaster();
		this.camera = camera;
		this.parent = parent;
		this._mouse = new THREE.Vector2();
		$(element).on('mousemove', this.onMouseMove.bind(this));
	}

	Raycaster.prototype.constructor = Raycaster;

	/**
	 * An event triggered when the mouse moves on the element. It calculates the mouse position in normalised device
	 * coordinates.
	 *
	 * @param event The jQuery mousemove event.
	 */
	Raycaster.prototype.onMouseMove = function (event) {
		this._mouse.set(
			(event.clientX / Viewport.getWidth()) * 2 - 1,
			-(event.clientY / Viewport.getHeight()) * 2 + 1
		);
	};

	/**
	 * The update method called on each render frame.
	 */
	Raycaster.prototype.update = function () {
		this.raycaster.setFromCamera(this._mouse, this.camera);
		var intersects = this.raycaster.intersectObjects(this.parent.children);
		intersects.forEach(function (intersect) {
			debugger;
			console.log(intersect);
		});
	};

	return Raycaster;

});
