/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var Handlebars = require('handlebars');

	var Point = require('view/points/point/Point');
	var Display = require('text!view/points/information/Information.hbs');

	function Information (renderer) {
		this.$canvas = $(renderer.getCanvas());
		this.$el = $('#information');
		this.template = Handlebars.compile(Display);
		this.addEventListeners(renderer);
	}

	/**
	 * Adds event listeners to this class.
	 *
	 * @param renderer The WebGL renderer.
	 */
	Information.prototype.addEventListeners = function (renderer) {
		var raycaster = renderer.raycaster;
		if (raycaster) {
			$(raycaster).on('raycast', this.onRaycast.bind(this));
		}
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