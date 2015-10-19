/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Convert = require('util/Convert');

	/**
	 * Initialises the point.
	 *
	 * @param model The point model.
	 * @param width The width of the point.
	 * @param height The height of the point.
	 * @param max The max value of all the points.
	 * @param [projection] The projection for the point.
	 * @constructor
	 */
	function Point (model, width, height, max, projection) {

		THREE.Mesh.call(this);

		this.model = model;
		this.model.on('applyFilter', this.onApplyFilter, this);

		// Set the width, height and the magnitude of the point.
		this.width = width;
		this.height = height;

		this.maxHeight = 100;

		// Create the geometry and compute its bounding box.
		var magnitude = Convert.range(new THREE.Vector2(0, max), new THREE.Vector2(0, this.maxHeight), model.get('magnitude'));
		var transform = Convert.transform(new THREE.Vector3(this.width, this.height, magnitude));
		var geometry = new THREE.BoxGeometry(transform.x, transform.y, transform.z);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, geometry.parameters.height * 0.5, 0));
		geometry.computeBoundingBox();
		// Set the geometry.
		this.geometry = geometry;

		// Obtain the bounding box of the geometry and set the min and max values.
		var boundingBox = geometry.boundingBox;

		this.min = boundingBox.min.y;
		this.max = boundingBox.max.y;

		// Set the transformed position data.
		this.updatePosition(model.position(), projection);

	}

	Point.prototype = Object.create(THREE.Mesh.prototype);
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
	 * @param colorRange The minimum and maximum HSV colour range for the point.
	 */
	Point.prototype.updateMaterial = function (material, mode, alpha, colors, colorRange) {
		material = material.clone();
		// Update the uniforms of the material.
		material.uniforms = {
			uMode: {type: 'i', value: mode},
			// Shared uniforms.
			uAlpha: {type: 'f', value: alpha},
			uBound: {type: 'v2', value: new THREE.Vector2(0, this.maxHeight)},
			// Basic shader uniforms.
			uMagnitude: {type: 'f', value: this.geometry.parameters.height},
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

	Point.prototype.onApplyFilter = function (applyFilter) {
		this.visible = !applyFilter;
	};

	return Point;

});
