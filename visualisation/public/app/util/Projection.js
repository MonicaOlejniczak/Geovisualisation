/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Convert = require('util/Convert');

	function Projection (projection, options) {
		options = options || {};
		this.projection = projection;
		this.target = options.target || new THREE.Vector3();
		this.offset = options.offset || 0;
		this.radius = options.radius || 1;
	}

	Projection.prototype.constructor = Projection;

	/**
	 * Applies the projection function on the instance.
	 */
	Projection.prototype.project = function () {
		this.projection.apply(this, arguments);
	};

	/**
	 * Applies a standard projection to an object that translates its position by the specified offset.
	 *
	 * @param object The object being translated.
	 * @param offset The offset to translate by.
	 */
	Projection.standard = function (object, offset) {
		offset = offset || this.offset;
		object.position.setY(offset);
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
		target = target || this.target;
		radius = radius || this.radius;
		theta = theta || (radius - object.position.x) * Math.PI / 180;
		phi = phi || (radius - object.position.z) * Math.PI / 180;
		object.position.copy(Convert.sphericalToCartesian(radius, theta, phi));
		object.lookAt(target);
		object.rotateX(Math.PI * -0.5);
	};

	return Projection;

});
