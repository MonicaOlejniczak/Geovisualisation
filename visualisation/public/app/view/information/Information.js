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

	function Information (renderer, points) {
		// Set the raycaster on the renderer.
		renderer.setRaycaster(points);
		// Set the canvas and element.
		this.$canvas = $(renderer.getCanvas());
		this.$el = $('#information');
		// Configure the template and add the event listeners.
		this.configureTemplate();
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
	 */
	Information.prototype.configureTemplate = function () {
		Handlebars.registerHelper('capitalize', this.capitalize.bind(this));
		Handlebars.registerHelper('format', this.format.bind(this));
		this.template = Handlebars.compile(Display);
	};

	/**
	 * Capitalizes the specified string.
	 *
	 * @param str The string to capitalize.
	 * @returns {string}
	 */
	Information.prototype.capitalize = function (str) {
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
	 * @param [precision] The precision being used.
	 * @returns {string|*}
	 */
	Information.prototype.formatNumber = function (value, precision) {
		value = parseInt(value, 10);
		precision = precision || 2;
		return value.toFixed(precision);
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
		this.toggleClasses(intersects);
		intersects.forEach(function (intersect) {
			var object = intersect.object;
			// Only update the information if the object is is a point.
			if (object instanceof Point) {
				this.updateInformation(coordinates, object.model);
			}
		}, this);
	};

	/**
	 * Toggles the hidden and pointer classes based on whether an intersection exists.
	 *
	 * @param intersects The intersection array.
	 */
	Information.prototype.toggleClasses = function (intersects) {
		var hasIntersection = intersects.length > 0;
		this.$el.toggleClass('hidden', !hasIntersection);
		this.$canvas.toggleClass('pointer', hasIntersection);
	};

	/**
	 * Updates the information for an intersected object.
	 *
	 * @param coordinates The mouse coordinates of the raycast.
	 * @param model The model of the intersected object.
	 */
	Information.prototype.updateInformation = function (coordinates, model) {
		this.$el.html(this.template(model.toJSON()))
			.css({
				left: coordinates.x,
				top: coordinates.y
			});
	};

	return Information;

});