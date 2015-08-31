/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var Handlebars = require('handlebars');

	var Point = require('view/points/point/Point');
	var Display = require('text!view/points/information/Information.hbs');

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
	 * Confifures the Handlebars template by registering helpers and compiling the template.
	 */
	Information.prototype.configureTemplate = function () {
		Handlebars.registerHelper('formatPosition', this.formatPosition.bind(this));
		this.template = Handlebars.compile(Display);
	};

	/**
	 * The function that formats the position.
	 *
	 * @param position The position being formatted.
	 * @returns {string} The formatted position.
	 */
	Information.prototype.formatPosition = function (position) {
		var precision = 2;
		return '[' +
			this.formatNumber(position.x, precision) + ', ' +
			this.formatNumber(position.y, precision) + ', ' +
			this.formatNumber(position.z, precision) + ']';
	};

	/**
	 * Formats a number to a particular precision.
	 *
	 * @param value The number being formatted.
	 * @param precision The precision being used.
	 * @returns {string|*}
	 */
	Information.prototype.formatNumber = function (value, precision) {
		value = parseInt(value, 10);
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
				this.updateInformation(coordinates, object);
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
	 * @param object The intersected object.
	 */
	Information.prototype.updateInformation = function (coordinates, object) {
		this.$el.html(this.template(object))
			.css({
				left: coordinates.x,
				top: coordinates.y
			});
	};

	return Information;

});