/**
 * @author Monica Olejniczak
 */
define(['threejs', 'app/canvas'], function (THREE, Canvas) {

	'use strict';

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	var Visualisation = function (canvas) {
		Canvas.call(this, canvas.get(0), {
			cameraPosition: new THREE.Vector3(0, 0, 75)
		});
	};

	Visualisation.prototype = Object.create(Canvas.prototype);
	Visualisation.prototype.constructor = Visualisation;

	return Visualisation;

});
