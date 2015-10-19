/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');

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
		this.mouse = new THREE.Vector2();
		this.coordinates = new THREE.Vector2();
		$(element).on('mousemove', this.onMouseMove.bind(this));
	}

	/**
	 * An event triggered when the mouse moves on the element. It calculates the mouse position in normalised device
	 * coordinates.
	 *
	 * @param event The jQuery mousemove event.
	 */
	Raycaster.prototype.onMouseMove = function (event) {
		var viewport = app.viewport;
		var offset = viewport.offset();
		this.mouse.set(event.clientX, event.clientY);
		this.coordinates.set(
			((event.clientX - offset.left) / viewport.width()) * 2 - 1,
			-((event.clientY - offset.top) / viewport.height()) * 2 + 1
		);
	};

	/**
	 * The update method called on each render frame.
	 */
	Raycaster.prototype.update = function () {
		this.raycaster.setFromCamera(this.coordinates, this.camera);
		var intersects = this.raycaster.intersectObject(this.parent, true);
		$(this).trigger('raycast', [this.mouse, intersects]);
	};

	return Raycaster;

});
