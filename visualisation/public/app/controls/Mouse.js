/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');
	var Viewport = require('Viewport');

	/**
	 * Initialises the mouse controls.
	 *
	 * @param camera The camera that is contained within the element.
	 * @param element The element that will be bound to the mouse events.
	 * @constructor
	 */
	var Mouse = function (camera, element) {
		this._viewport = new Viewport();
		this.camera = camera;
		this.element = element;
		this.epsilon = 1e-4;
		// Add the origin vector.
		this.origin = new THREE.Vector3();
		// Add the pan and rotate start.
		this.panStart = new THREE.Vector2();
		this.rotateStart = new THREE.Vector2();
		// Add a zoom factor and rotation speed.
		this.zoomFactor = 0.05;
		this.rotateSpeed = 25;
		// Add the event listeners to the element.
		this._addEventListeners(element);
	};

	Mouse.prototype.constructor = Mouse;

	/**
	 * Adds event listeners to the element.
	 *
	 * @param element The element that will be bound to the mouse events.
	 * @private
	 */
	Mouse.prototype._addEventListeners = function (element) {
		$(element).on({
			contextmenu: this._onContextMenu.bind(this),
			mousedown: this._onMouseDown.bind(this),
			wheel: this._onMouseWheel.bind(this)
		});
	};

	/**
	 * Zooms the camera in or out depending on the value passed into the function. It simply translates the camera on
	 * its z-axis.
	 *
	 * @param value The value to zoom by.
	 * @private
	 */
	Mouse.prototype._zoom = function (value) {
		this.camera.translateZ(-value);
	};

	/**
	 * Pans the camera by adjusting the x and y values of its position based on the x and y delta values.
	 *
	 * @param delta The x and y delta values calculated by taking the current screen coordinates and subtracting the original screen coordinates.
	 * @private
	 */
	Mouse.prototype._pan = function (delta) {
		// Clone the position of the camera.
		var cameraPosition = this.camera.position.clone();
		// Obtain the distance of the camera to the origin and multiply it by the top half of the camera field of view.
		var distance = cameraPosition.length() * Math.tan(THREE.Math.degToRad(this.camera.fov * 0.5));
		// Store the pan position using the screen height.
		var position = new THREE.Vector2(
			-2 * delta.x * distance / this._viewport.getHeight(),
			2 * delta.y * distance / this._viewport.getHeight()
		);
		// Apply the position to the camera and update the origin value.
		this.camera.translateX(position.x);
		this.camera.translateY(position.y);
		this.origin.add(this.camera.position.clone().sub(cameraPosition));
	};

	/**
	 * Rotates the camera by altering its position based on the x and y delta values.
	 *
	 * @param delta The x and y delta values calculated by taking the current screen coordinates and subtracting the original screen coordinates.
	 * @private
	 */
	Mouse.prototype._rotate = function (delta) {
		// Store the rotate position.
		var position = new THREE.Vector2(
			-2 * Math.PI * delta.x / this._viewport.getWidth() * this.rotateSpeed,
			-2 * Math.PI * delta.y / this._viewport.getHeight() * this.rotateSpeed
		);
		// Apply the translation for the camera on a 360 degree angle.
		this.camera.translateX(position.x);
		this.camera.translateY(position.y);
		// Ensure the camera is facing the origin.
		this.camera.lookAt(this.origin);
	};

	/**
	 * Clamp the position between the specified bounds so that the position never reaches beyond +-90 degrees.
	 *
	 * @param position The value of the current position.
	 * @private
	 */
	Mouse.prototype._clampPosition = function (position) {
		position.x = Math.min(Math.PI * 0.5 - this.epsilon, Math.max(-Math.PI * 0.5 + this.epsilon, position.x));
		position.y = Math.min(Math.PI * 0.5 - this.epsilon, Math.max(-Math.PI * 0.5 + this.epsilon, position.y));
	};

	/**
	 * An event that is triggered when the user releases a right mouse button click.
	 *
	 * @param event The jQuery contextmenu event.
	 * @private
	 */
	Mouse.prototype._onContextMenu = function (event) {
		event.preventDefault();
		return false;
	};

	/**
	 * An event that is triggered when the user clicks a mouse button. It prevents the default action taken by the
	 * browser and calls either the pan or rotate functions.
	 *
	 * @param event The jQuery mousedown event.
	 * @private
	 */
	Mouse.prototype._onMouseDown = function (event) {
		switch (event.which) {
			case 1:
				this.panStart.set(event.clientX, event.clientY);
				$(this.element).on({
					'mousemove.pan': this._onPan.bind(this),
					'mouseup.pan': this._onReleasePan.bind(this)
				});
				break;
			case 3:
				this.rotateStart.set(event.clientX, event.clientY);
				$(this.element).on({
					'mousemove.rotate': this._onRotate.bind(this),
					'mouseup.rotate': this._onReleaseRotate.bind(this)
				});
				break;
		}
	};

	/**
	 * An event triggered when the user begins to pan.
	 *
	 * @param event The jQuery mousemove event registered after a left mouseclick.
	 * @private
	 */
	Mouse.prototype._onPan = function (event) {
		// Get the x and y screen coordinates.
		var x = event.clientX;
		var y = event.clientY;
		// Call the pan function with the x and y deltas.
		this._pan(new THREE.Vector2(x - this.panStart.x, y - this.panStart.y));
		// Update the pan start to the current screen coordinates.
		this.panStart.set(x, y);
	};

	/**
	 * Removes the panning events when the pan button is released.
	 *
	 * @param event The jQuery mouseup event registered after a left mouseclick.
	 * @private
	 */
	Mouse.prototype._onReleasePan = function (event) {
		$(this.element).off('mousemove.pan mouseup.pan');
	};

	/**
	 * An event triggered when the user begins to rotate.
	 *
	 * @param event The jQuery mousemove event registered after a right mouseclick.
	 * @private
	 */
	Mouse.prototype._onRotate = function (event) {
		// Get the x and y screen coordinates.
		var x = event.clientX;
		var y = event.clientY;
		// Call the rotate function with the x and y deltas.
		this._rotate(new THREE.Vector2(x - this.rotateStart.x, y - this.rotateStart.y));
		// Update the rotate start to the current screen coordinates.
		this.rotateStart.set(x, y);
	};

	/**
	 * Remove the rotate events when the rotate mouse button is released.
	 *
	 * @param event The jQuery mouseup event registered after a right mouseclick.
	 * @private
	 */
	Mouse.prototype._onReleaseRotate = function (event) {
		$(this.element).off('mousemove.rotate mouseup.rotate');
	};

	/**
	 * An event that is triggered when the user scrolls with the mouse wheel. It prevents the default action taken by
	 * the browser and calls the zoom function.
	 *
	 * @param event The jQuery wheel event.
	 * @private
	 */
	Mouse.prototype._onMouseWheel = function (event) {
		event.preventDefault();
		var originalEvent = event.originalEvent;
		this._zoom((originalEvent.wheelDeltaY || originalEvent.detail) * this.zoomFactor);
	};

	return Mouse;

});
