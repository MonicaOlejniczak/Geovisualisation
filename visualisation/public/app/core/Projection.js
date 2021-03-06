/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Convert = require('util/Convert');

	function Projection (projection, options) {
		this.projection = projection;
		this.options = options || {};
	}

	/**
	 * Applies the projection function on the instance.
	 */
	Projection.prototype.project = function () {
		this.projection.apply(this, arguments);
	};

	/**
	 * Applies a standard projection to an object that translates its position by the specified offset and constrains
	 * the x and z position of the coordinate to its bounds.
	 *
	 * @param object The object being translated.
	 * @param offset The offset to translate by.
	 * @param bounds
	 */
	Projection.standard = function (object, offset, bounds) {

		var options = this.options;
		var position  = object.position;

		offset = offset || options.offset || 0;
		bounds = bounds || options.bounds || new THREE.Vector2(new THREE.Vector2(), new THREE.Vector2());

		if (offset) {
			object.position.setY(offset);
		}

		if (bounds) {
			object.position.setX(Convert.range(bounds.x.x, bounds.x.y, position.x));
			object.position.setZ(Convert.range(bounds.y.x, bounds.y.y, -position.z));
		}

	};

	/**
	 * Applies a spherical projection to an object given a target vector, radius and spherical coordinate angles.
	 *
	 * @param object The object being projected.
	 * @param target The target vector for the object to look at.
	 * @param radius The radial distance.
	 * @param theta The azimuthal angle.
	 * @param phi The polar angle.
	 */
	Projection.spherical = function (object, target, radius, theta, phi) {

		var options = this.options;
		var position = object.position;
		var bounds = options.bounds || new THREE.Vector2(new THREE.Vector2(), new THREE.Vector2());

		target = target || options.target || new THREE.Vector3();
		radius = radius || options.radius || 1;


		// TODO make nicer
		//theta = theta || THREE.Math.degToRad(Convert.range(this.thetaBound, new THREE.Vector2(0, 360), position.x)) - Math.PI * 0.5;
		theta = theta || THREE.Math.degToRad(position.x);
		//phi = phi || THREE.Math.degToRad(-position.z);
		phi = phi || THREE.Math.degToRad(Convert.range(bounds.y.x, bounds.y.y, -position.z));

		object.position.copy(Convert.sphericalToCartesian(radius, theta, phi));
		object.lookAt(target);
		object.rotateX(Math.PI * -0.5);

	};

	return Projection;

});
