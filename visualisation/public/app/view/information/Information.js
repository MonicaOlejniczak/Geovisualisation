/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');
	var Handlebars = require('handlebars');

	var Point = require('component/points/point/Point');
	var Display = require('text!view/information/Information.hbs');

	function Information (renderer, points, filters) {
		// Set the raycaster on the renderer.
		renderer.setRaycaster(points);
		// Set the canvas and element.
		this.$canvas = $(renderer.canvas);
		this.$el = $('#information');
		// Add the offset and filters.
		this.offset = 10;
		this.filters = filters || [];
		// Configure the template and add the event listeners.
		this.template = this.configureTemplate();
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
	 * Configures the Handlebars template by registering helpers and compiling the template.
	 *
	 * @returns {*}
	 */
	Information.prototype.configureTemplate = function () {
		Handlebars.registerHelper('filter', this.filter.bind(this));
		Handlebars.registerHelper('capitalize', this.capitalize.bind(this));
		Handlebars.registerHelper('format', this.format.bind(this));
		return Handlebars.compile(Display);
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
	 * Capitalizes the specified string.
	 *
	 * @param str The string to capitalize.
	 * @returns {string}
	 */
	Information.prototype.capitalize = function (str) {
		str = str.replace('_', ' ');
		return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
	};

	/**
	 * Formats a value based on its type.
	 *
	 * @param value The value to format.
	 * @returns {*} The formatted value.
	 */
	Information.prototype.format = function (value) {
		if (typeof value === 'number') {
			return this.formatNumber(value);
		} else if (typeof value === 'object') {
			if (value instanceof THREE.Vector2 || value instanceof THREE.Vector3 || value instanceof THREE.Vector4) {
				return this.formatVector(value);
			}
		}
		return value;
	};

	/**
	 * The function that formats a Vector.
	 *
	 * @param vector The vector being formatted.
	 * @returns {string} The formatted vector.
	 */
	Information.prototype.formatVector = function (vector) {
		// Initialise the str that will be returned.
		var str = '[';
		// Get the keys from the vector and its length.
		var keys = Object.keys(vector);
		var len = keys.length;
		// Iterate through each key in the vector.
		keys.forEach(function (key, index) {
			// Append the formatted number to the string, followed by a ', ' if the current iteration is not at the
			// last key.
			str += this.formatNumber(vector[key]) + (index < len - 1 ? ', ' : '');
		}, this);
		// Return the string with a closing bracket.
		return str + ']';
	};

	/**
	 * Formats a number to a particular precision.
	 *
	 * @param value The number being formatted.
	 * @returns {string|*}
	 */
	Information.prototype.formatNumber = function (value) {
		return value.toLocaleString().replace(/,/g, ', ');
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
				this.updateInformation(coordinates, object.model);
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
		this.$canvas.toggleClass('pointer', hide);
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
	Information.prototype.updateInformation = function (coordinates, model) {
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
		var $element = this.$canvas;
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