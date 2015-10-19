/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');
	var Handlebars = require('handlebars');

	var Point = require('component/points/point/Point');
	var template = require('text!component/information/Information.hbs');

	function Information (renderer, points, filters) {
		// Set the raycaster on the renderer.
		renderer.setRaycaster(points);
		this.$el = $('#information');
		// Add the offset and filters.
		this.offset = 10;
		this.filters = filters || [];
		// Configure the template and add the event listeners.
		Handlebars.registerHelper('filter', this.filter.bind(this));
		this.template = Handlebars.compile(template);
		this.addEventListeners(renderer);
	}

	/**
	 * Adds event listeners to this class.
	 *
	 * @param renderer The WebGL renderer.
	 */
	Information.prototype.addEventListeners = function (renderer) {
		$(renderer.raycaster).on('raycast', this.onRaycast.bind(this));
	};

	/**
	 * A helper function used to show or hide particular information based on the filters array.
	 *
	 * @param key The key passed into the filter helper.
	 * @returns {boolean}
	 */
	Information.prototype.filter = function (key) {
		return this.filters.indexOf(key) !== -1;
	};

	/**
	 * An event triggered when the raycaster triggers an intersects event. It displays the information for the
	 * selected point.
	 *
	 * @param event The intersects event.
	 * @param coordinates The mouse coordinates of the raycast.
	 * @param intersects The intersects objects.
	 */
	Information.prototype.onRaycast = function (event, coordinates, intersects) {
		intersects = intersects || [];
		this.toggleClasses(false);
		for (var i = 0, len = intersects.length; i < len; i++) {
			var object = intersects[i].object;
			// Only update the information if the object is is a point.
			if (object instanceof Point && object.visible) {
				this.toggleClasses(true);
				this.update(coordinates, object.model);
				break;
			}
		}
	};

	/**
	 * Toggles the hidden and pointer classes based on whether an intersection exists.
	 *
	 * @param hide
	 */
	Information.prototype.toggleClasses = function (hide) {
		this.$el.toggleClass('hidden', !hide);
		app.$canvas.toggleClass('pointer', hide);
	};

	/**
	 * Clears the information HTML.
	 */
	Information.prototype.clear = function () {
		this.$el.html();
	};

	/**
	 * Updates the information for an intersected object.
	 *
	 * @param coordinates The mouse coordinates of the raycast.
	 * @param model The model of the intersected object.
	 */
	Information.prototype.update = function (coordinates, model) {
		this.$el.html(this.template(model.toJSON()));
		var position = this.calculatePosition(coordinates);
		this.$el.css({
			left: position.x,
			top: position.y
		});
	};

	/**
	 * Calculates the position needed for the information display given a set of mouse coordinates.
	 *
	 * @param coordinates A set of mouse coordinates.
	 * @returns {THREE.Vector2}
	 */
	Information.prototype.calculatePosition = function (coordinates) {
		// Get the quadrant given the coordinates.
		var quadrant = this.getQuadrant(coordinates);
		// Calculate the x and y values based on the quadrant.
		var x = coordinates.x + (quadrant === 1 || quadrant === 4 ? -this.$el.outerWidth() - this.offset : 1.5 * this.offset);
		var y = coordinates.y + (quadrant === 1 || quadrant === 2 ? this.offset : -this.$el.outerHeight() + this.offset);
		return new THREE.Vector2(x, y);
	};

	/**
	 * Determines the quadrant for a given position within the canvas.
	 *
	 * @param position The current position within the element.
	 * @returns {number}
	 */
	Information.prototype.getQuadrant = function (position) {
		var $element = app.$canvas;
		// Set the boundaries of the element.
		var boundary = new THREE.Vector2($element.width() * 0.5, $element.height() * 0.5);
		// Check if in quadrant 1 or 4.
		if (position.x > boundary.x) {
			return position.y < boundary.y ? 1 : 4;
		}
		// Otherwise, quadrant 2 or 3.
		return position.y < boundary.y ? 2 : 3;
	};

	return Information;

});