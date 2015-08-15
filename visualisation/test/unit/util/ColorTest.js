define(function (require) {

	'use strict';

	var expect = require('chai').expect;

	var THREE = require('threejs');
	var Color = require('util/Color');

	describe('the Color module', function () {

		var color;

		describe('the generate method', function () {

			var generate;

			afterEach(function () {
				expect(color).to.not.eql(generate);
			});

			it('should generate a random color', function () {
				color = Color.generate();
				generate = Color.generate();
			});

		});

		describe('the blend method', function () {

			var blend;

			afterEach(function () {

				expect(color.r).to.be.closeTo(blend.r, 0.1);
				expect(color.g).to.be.closeTo(blend.g, 0.1);
				expect(color.b).to.be.closeTo(blend.b, 0.1);

			});

			it('should blend black and white', function () {
				color = Color.blend(new THREE.Color(0x000000), new THREE.Color(0xffffff));
				blend = new THREE.Color(0x808080);
			});

			it('should blend red and green', function () {
				color = Color.blend(new THREE.Color(0xff0000), new THREE.Color(0x00ff00));
				blend = new THREE.Color(0x808000);
			});

			it('should blend red and blue', function () {
				color = Color.blend(new THREE.Color(0xff0000), new THREE.Color(0x0000ff));
				blend = new THREE.Color(0x800080);
			});

			it('should blend green and blue', function () {
				color = Color.blend(new THREE.Color(0x00ff00), new THREE.Color(0x0000ff));
				blend = new THREE.Color(0x008080);
			});

		});

		describe('the luminance method', function () {

			var luminance;

			afterEach(function () {
				expect(color).to.eql(luminance);
			});

			it('should not change the colour when the luminance is 0', function () {
				color = Color.luminance(new THREE.Color(0xffffff), 0);
				luminance = new THREE.Color(0xffffff);
			});

			it('should darken a colour', function () {
				color = Color.luminance(new THREE.Color(0xffffff), -1);
				luminance = new THREE.Color(0x000000);
			});

			it('should lighten a colour', function () {
				color = Color.luminance(new THREE.Color(0x000000), 1);
				luminance = new THREE.Color(0xffffff);
			});

		});

	});
});
