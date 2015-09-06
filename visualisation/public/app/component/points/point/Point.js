/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Component = require('component/Component');
	var Convert = require('util/Convert');

	/**
	 * Initialises the point.
	 *
	 * @param model The point model.
	 * @param width The width of the point.
	 * @param height The height of the point.
	 * @param [projection] The projection for the point.
	 * @constructor
	 */
	function Point (model, width, height, projection) {

		this.model = model;
		Component.apply(this, arguments);

		// Set the transformed position data.
		var position = Convert.transform(model.get('x'), model.get('y'), model.get('z'));

		// Set the width, height and the magnitude of the point.
		this.width = width;
		this.height = height;
		this.magnitude = position.y;

		model.set('magnitude', this.magnitude);

		// Create the geometry and compute its bounding box.
		var transform = Convert.transform(this.width, this.height, this.magnitude);
		var geometry = new THREE.BoxGeometry(transform.x, transform.y, transform.z);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.magnitude * 0.5, 0));
		geometry.computeBoundingBox();
		// Set the geometry.
		this.geometry = geometry;

		// Obtain the bounding box of the geometry and set the min and max values.
		var boundingBox = geometry.boundingBox;

		this.min = boundingBox.min.y;
		this.max = boundingBox.max.y;

		this.updatePosition(position, projection);

	}

	Point.prototype = Object.create(Component.prototype);
	Point.prototype.constructor = Point;

	/**
	 * Updates the position of the point and applied a projection if it exists.
	 *
	 * @param position The new position for the point.
	 * @param [projection] The projection instance.
	 */
	Point.prototype.updatePosition = function (position, projection) {
		this.position.copy(position);
		if (projection) {
			projection.project.call(projection, this);
		}
	};

	/**
	 * Updates the material and the associated uniforms of the point;
	 *
	 * @param material The new material for the point.
	 * @param mode The shader to use for displaying the data.
	 * @param alpha The opacity of the point.
	 * @param colors The colours used with the material.
	 * @param bound The global min and max values of all points.
	 * @param colorRange The minimum and maximum HSV colour range for the point.
	 */
	Point.prototype.updateMaterial = function (material, mode, alpha, colors, bound, colorRange) {
		material = material.clone();
		// Update the uniforms of the material.
		material.uniforms = {
			uMode: {type: 'i', value: mode},
			// Shared uniforms.
			uAlpha: {type: 'f', value: alpha},
			uBound: {type: 'v2', value: bound},
			// Basic shader uniforms.
			uMagnitude: {type: 'f', value: this.magnitude},
			uColorRange: {type: 'v2', value: colorRange},
			uSaturation: {type: 'f', value: 1.0},
			uLightness: {type: 'f', value: 1.0},
			// Gradient shader uniforms.
			uLowColor: {type: 'c', value: colors.low},
			uMediumColor: {type: 'c', value: colors.medium},
			uHighColor: {type: 'c', value: colors.high}
		};
		// Obtain the mesh and update its material.
		this.material = material;
	};

	return Point;

});
