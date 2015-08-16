/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');
	var Viewport = require('Viewport');

	var Convert = require('util/Convert');

	/**
	 * Initialises the mouse controls.
	 *
	 * @param camera The camera that is contained within the element.
	 * @param element The element that will be bound to the mouse events.
	 * @constructor
	 */
	function Mouse (camera, element) {
		// Store the viewport, camera and element.
		this._viewport = Viewport;
		this.camera = camera;
		this.element = element;
		// Assign the boundary values.
		this._epsilon = 1e-4;
		this.minCameraHeight = 1;
		this.minPolarAngle = 0;
		this.maxPolarAngle = Math.PI * 0.45;
		// Add the origin vector.
		this.origin = new THREE.Vector3();
		// Add the pan and rotate start.
		this.panStart = new THREE.Vector2();
		this.rotateStart = new THREE.Vector2();
		// Add a zoom factor and rotation speed.
		this.zoomFactor = 0.05;
		this.rotateSpeed = 1;
		// Add the event listeners to the element.
		this.addEventListeners(element);
	}

	Mouse.prototype.constructor = Mouse;

	/**
	 * Adds event listeners to the element.
	 *
	 * @param element The element that will be bound to the mouse events.
	 */
	Mouse.prototype.addEventListeners = function (element) {
		$(element).on({
			contextmenu: this.onContextMenu.bind(this),
			mousedown: this.onMouseDown.bind(this),
			wheel: this.onMouseWheel.bind(this)
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
		// Clone the original camera position.
		var position = this.camera.position.clone();
		// Apply the translation.
		this.camera.translateZ(-value);
		// Check if the y position of the camera is outside of its bounds and restore the original position.
		if (this.camera.position.y < this.minCameraHeight) {
			this.camera.position.copy(position);
			this.camera.position.setY(this.minCameraHeight);
		}
		$(this).trigger('zoom', this.camera.position);
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
		this.camera.position.setY(Math.max(this.minCameraHeight, this.camera.position.y));
		this.origin.add(this.camera.position.clone().sub(cameraPosition));
		$(this).trigger('pan', this.camera.position);
	};

	/**
	 * Rotates the camera by altering its position based on the x and y delta values.
	 *
	 * @param delta The x and y delta values calculated by taking the current screen coordinates and subtracting the original screen coordinates.
	 * @private
	 */
	Mouse.prototype._rotate = function (delta) {
		// Get the position offset of the camera from the current origin.
		var position = this.camera.position.clone().sub(this.origin);
		// Get the radius of the spherical coordinate by applying sqrt(x^2 + y^2 + z^2) of the position.
		var radius = position.length();
		// Calculate the theta and phil delta angles i.e. the angle that the user has moved the camera on rotation.
		var thetaDelta = -2 * Math.PI * delta.x / this._viewport.getWidth() * this.rotateSpeed;
		var phiDelta = -2 * Math.PI * delta.y / this._viewport.getHeight() * this.rotateSpeed;
		// Calculate the theta and phi angles by getting the angle from the z-axis around the y-axis (azimuth - theta) and from the y-axis (polar - phi)
		var theta = thetaDelta + Math.atan2(position.x, position.z);
		var phi = phiDelta + Math.atan2(Math.sqrt(position.x * position.x + position.z * position.z), position.y);
		// Clamp the elevation angle so it is between its minimum and maximum polar angle boundary.
		phi = Math.min(this.maxPolarAngle - this._epsilon, Math.max(this.minPolarAngle + this._epsilon, phi));
		// Apply the position to the camera.
		this.camera.position.copy(this.origin).add(Convert.sphericalToCartesian(radius, theta, phi));
		// Ensure the camera is facing the origin.
		this.camera.lookAt(this.origin);
		$(this).trigger('rotate', this.camera.position);
	};

	/**
	 * An event that is triggered when the user releases a right mouse button click.
	 *
	 * @param event The jQuery contextmenu event.
	 */
	Mouse.prototype.onContextMenu = function (event) {
		event.preventDefault();
		return false;
	};

	/**
	 * An event that is triggered when the user clicks a mouse button. It prevents the default action taken by the
	 * browser and calls either the pan or rotate functions.
	 *
	 * @param event The jQuery mousedown event.
	 */
	Mouse.prototype.onMouseDown = function (event) {
		switch (event.which) {
			case 1:
				this.panStart.set(event.clientX, event.clientY);
				$(this.element).on({
					'mousemove.pan': this.onPan.bind(this),
					'mouseup.pan': this.onReleasePan.bind(this)
				});
				break;
			case 3:
				this.rotateStart.set(event.clientX, event.clientY);
				$(this.element).on({
					'mousemove.rotate': this.onRotate.bind(this),
					'mouseup.rotate': this.onReleaseRotate.bind(this)
				});
				break;
		}
	};

	/**
	 * An event triggered when the user begins to pan.
	 *
	 * @param event The jQuery mousemove event registered after a left mouseclick.
	 */
	Mouse.prototype.onPan = function (event) {
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
	 */
	Mouse.prototype.onReleasePan = function (event) {
		$(this.element).off('mousemove.pan mouseup.pan');
	};

	/**
	 * An event triggered when the user begins to rotate.
	 *
	 * @param event The jQuery mousemove event registered after a right mouseclick.
	 */
	Mouse.prototype.onRotate = function (event) {
		// Get the x and y screen coordinates.
		var coordinates = new THREE.Vector2(event.clientX, event.clientY);
		// Call the rotate function with the x and y deltas.
		this._rotate(new THREE.Vector2(coordinates.x - this.rotateStart.x, coordinates.y - this.rotateStart.y));
		// Update the rotate start to the current screen coordinates.
		this.rotateStart.copy(coordinates);
	};

	/**
	 * Remove the rotate events when the rotate mouse button is released.
	 *
	 * @param event The jQuery mouseup event registered after a right mouseclick.
	 */
	Mouse.prototype.onReleaseRotate = function (event) {
		$(this.element).off('mousemove.rotate mouseup.rotate');
	};

	/**
	 * An event that is triggered when the user scrolls with the mouse wheel. It prevents the default action taken by
	 * the browser and calls the zoom function.
	 *
	 * @param event The jQuery wheel event.
	 */
	Mouse.prototype.onMouseWheel = function (event) {
		event.preventDefault();
		var originalEvent = event.originalEvent;
		this._zoom((originalEvent.wheelDeltaY || originalEvent.detail) * this.zoomFactor);
	};

	return Mouse;

});
