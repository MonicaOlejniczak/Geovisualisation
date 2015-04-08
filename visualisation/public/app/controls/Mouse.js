/**
 * @author Monica Olejniczak
 */
define(['jquery'], function ($) {

	'use strict';

	/**
	 * Initialises the mouse controls.
	 *
	 * @param camera The camera that is contained within the element.
	 * @param element The element that will be bound to the mouse events.
	 * @constructor
	 */
	var Mouse = function (camera, element) {
		this.camera = camera;
		this.element = element;
		// Add a zoom factor.
		this.zoomFactor = 0.05;
		 // Add a mouse down listener to the element.
		 $(element).bind('mousedown', this.onMouseDown.bind(this));
		 // Add a mouse wheel listener to the element.
		 $(element).bind('wheel DOMMouseScroll', this.onMouseWheel.bind(this));
	};

	Mouse.prototype.constructor = Mouse;

	/**
	 * Zooms the camera in or out depending on the value passed into the function. It simply translates the camera on
	 * its z-axis.
	 *
	 * @param value The value to zoom by.
	 */
	Mouse.prototype.zoom = function (value) {
		this.camera.translateZ(-value);
	};

	Mouse.prototype.pan = function () {
		debugger;
	};

	Mouse.prototype.rotate = function () {

	};

	/**
	 * An event that is triggered when the user clicks a mouse button. It prevents the default action taken by the
	 * browser and calls either the pan or rotate functions.
	 *
	 * @param event The mouse down event.
	 */
	Mouse.prototype.onMouseDown = function (event) {
		event.preventDefault();
		switch (event.which) {
			case 1:
				this.pan();
				break;
			case 3:
				this.rotate();
				break;
		}
	};

	/**
	 * An event that is triggered when the user scrolls with the mouse wheel. It prevents the default action taken by
	 * the browser and calls the zoom function.
	 *
	 * @param event The wheel event.
	 */
	Mouse.prototype.onMouseWheel = function (event) {
		event.preventDefault();
		var originalEvent = event.originalEvent;
		this.zoom((originalEvent.wheelDeltaY || originalEvent.detail) * this.zoomFactor);
	};

	return Mouse;

});
