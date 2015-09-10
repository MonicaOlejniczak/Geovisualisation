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
		this.thetaBound = options.thetaBound || new THREE.Vector2();
		this.phiBound = options.phiBound || new THREE.Vector2();
	}

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
		var position = object.position;

		target = target || this.target;
		radius = radius || this.radius;

		//theta = theta || THREE.Math.degToRad(Convert.range(this.thetaBound, new THREE.Vector2(0, 360), position.x)) - Math.PI * 0.5;
		theta = theta || THREE.Math.degToRad(position.x);
		phi = phi || THREE.Math.degToRad(Convert.range(this.phiBound, new THREE.Vector2(0, 180), -position.z));

		object.position.copy(Convert.sphericalToCartesian(radius, theta, phi));
		object.lookAt(target);
		object.rotateX(Math.PI * -0.5);

	};

	return Projection;

});
