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
		this._configureTemplate();
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
	 *
	 * @private
	 */
	Information.prototype._configureTemplate = function () {
		Handlebars.registerHelper('formatPosition', this._formatPosition.bind(this));
		this.template = Handlebars.compile(Display);
	};

	/**
	 * The function that formats the position.
	 *
	 * @param position The position being formatted.
	 * @returns {string} The formatted position.
	 * @private
	 */
	Information.prototype._formatPosition = function (position) {
		var precision = 2;
		return '[' +
			this._formatNumber(position.x, precision) + ', ' +
			this._formatNumber(position.y, precision) + ', ' +
			this._formatNumber(position.z, precision) + ']';
	};

	/**
	 * Formats a number to a particular precision.
	 *
	 * @param value The number being formatted.
	 * @param precision The precision being used.
	 * @returns {string|*}
	 * @private
	 */
	Information.prototype._formatNumber = function (value, precision) {
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
		this._toggleClasses(intersects);
		intersects.forEach(function (intersect) {
			var object = intersect.object;
			// Only update the information if the object is is a point.
			if (object instanceof Point) {
				this._updateInformation(coordinates, object);
			}
		}, this);
	};

	/**
	 * Toggles the hidden and pointer classes based on whether an intersection exists.
	 *
	 * @param intersects The intersection array.
	 * @private
	 */
	Information.prototype._toggleClasses = function (intersects) {
		var hasIntersection = intersects.length > 0;
		this.$el.toggleClass('hidden', !hasIntersection);
		this.$canvas.toggleClass('pointer', hasIntersection);
	};

	/**
	 * Updates the information for an intersected object.
	 *
	 * @param coordinates The mouse coordinates of the raycast.
	 * @param object The intersected object.
	 * @private
	 */
	Information.prototype._updateInformation = function (coordinates, object) {
		this.$el.html(this.template(object))
			.css({
				left: coordinates.x,
				top: coordinates.y
			});
	};

	return Information;

});