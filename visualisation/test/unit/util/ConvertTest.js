define(function (require) {

	'use strict';

	var expect = require('chai').expect;

	var THREE = require('threejs');
	var Convert = require('util/Convert');

	describe('the Convert module', function () {

		it('should transform a coordinate into a vector of the correct space', function () {

			var x = Math.random();
			var y = Math.random();
			var z = Math.random();

			expect(Convert.transform(new THREE.Vector3(x, y, z))).to.eql(new THREE.Vector3(x, z, y));

		});

		it('should transform a spherical coordinate to cartesian', function () {

			var radius = 5;
			var theta = 1;
			var phi = 0.5;

			var cartesian = Convert.sphericalToCartesian(radius, theta, phi);

			expect(cartesian.x).to.be.closeTo(2.018, 0.1);
			expect(cartesian.y).to.be.closeTo(4.387, 0.1);
			expect(cartesian.z).to.be.closeTo(1.295, 0.1);

		});

		describe('range method', function () {

			it('should convert a value from a smaller positive range to a larger positive range', function () {

				var origin = new THREE.Vector2(0, 1);
				var target = new THREE.Vector2(0, 100);
				var value = 0.5;

				expect(Convert.range(origin, target, value)).to.equal(50);

			});

			it('should convert a value from a larger positive range to a smaller positive range', function () {

				var origin = new THREE.Vector2(0, 100);
				var target = new THREE.Vector2(0, 1);
				var value = 50;

				expect(Convert.range(origin, target, value)).to.equal(0.5);

			});

			it('should convert a value from a smaller negative range to a larger negative range', function () {

				var origin = new THREE.Vector2(-1000, -500);
				var target = new THREE.Vector2(-100, -50);
				var value = -750;

				expect(Convert.range(origin, target, value)).to.equal(-75);

			});

			it('should convert a value from a larger negative range to a smaller negative range', function () {

				var origin = new THREE.Vector2(-100, -50);
				var target = new THREE.Vector2(-1000, -500);
				var value = -75;

				expect(Convert.range(origin, target, value)).to.equal(-750);

			});

			it('should convert a value from a positive range to a negative range', function () {

				var origin = new THREE.Vector2(50, 100);
				var target = new THREE.Vector2(-100, -50);
				var value = 75;

				expect(Convert.range(origin, target, value)).to.equal(-75);

			});

			it('should convert a value from a negative range to a positive range', function () {

				var origin = new THREE.Vector2(-100, -50);
				var target = new THREE.Vector2(50, 100);
				var value = -75;

				expect(Convert.range(origin, target, value)).to.equal(75);

			});

		});

	});
});
