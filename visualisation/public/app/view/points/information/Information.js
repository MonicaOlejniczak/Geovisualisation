/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	function Information (canvas, raycaster) {
		this.canvas = canvas;
		this.display = $('#information');
		$(raycaster).on('raycast', this.onRaycast.bind(this));
	}

	/**
	 * An event triggered when the raycaster triggers an intersects event. It displays the information for the
	 * selected point.
	 *
	 * @param event The intersects event.
	 * @param coordinates The mouse coordinates of the raycast.
	 * @param intersects The intersects objects.
	 */
	Information.prototype.onRaycast = function (event, coordinates, intersects) {
		var display = this.display;
		intersects = intersects || [];
		this._toggleClasses(display, intersects);
		intersects.forEach(function (intersect) {
			var object = intersect.object;
			display.html(object.magnitude.toFixed(2));
			display.css({
				left: coordinates.x,
				top: coordinates.y
			});
		}, this);
	};

	/**
	 * Toggles the hidden and pointer classes based on whether an intersection exists.
	 *
	 * @param display The information display.
	 * @param intersects The intersection array.
	 * @private
	 */
	Information.prototype._toggleClasses = function (display, intersects) {
		var hasIntersection = intersects.length > 0;
		display.toggleClass('hidden', !hasIntersection);
		this.canvas.toggleClass('pointer', hasIntersection);
	};

	return Information;

});