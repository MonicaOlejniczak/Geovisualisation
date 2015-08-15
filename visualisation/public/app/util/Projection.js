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

	Projection.prototype.project = function () {
		this.projection.apply(this, arguments);
	};

	Projection.standard = function (object, offset) {
		offset = offset || this.offset;
		object.position.setY(offset);
	};

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
