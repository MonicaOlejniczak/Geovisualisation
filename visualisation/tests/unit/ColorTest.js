define(function (require) {

	'use strict';

	var bdd = require('intern!bdd');
	var expect = require('intern/chai!expect');

	var THREE = require('threejs');
	var Color = require('app/util/Color');

	bdd.describe('the Color module', function () {

		var color;

		bdd.after(function () {

			expect(color).to.be.an.instanceof(THREE.Color);

			expect(color.r).to.be.within(0, 1);
			expect(color.g).to.be.within(0, 1);
			expect(color.b).to.be.within(0, 1);

		});

		bdd.it('should generate a random color', function () {
			color = Color.generate();
		});

		bdd.describe('the blend method', function () {

			var blend;

			bdd.after(function () {

				expect(blend).to.be.an.instanceof(THREE.Color);

				expect(color.r).to.be.closeTo(blend.r, 0.1);
				expect(color.g).to.be.closeTo(blend.g, 0.1);
				expect(color.b).to.be.closeTo(blend.b, 0.1);

				expect(blend.r).to.be.within(0, 1);
				expect(blend.g).to.be.within(0, 1);
				expect(blend.b).to.be.within(0, 1);

			});

			bdd.it('should blend black and white', function () {
				color = Color.blend(new THREE.Color(0x000000), new THREE.Color(0xffffff));
				blend = new THREE.Color(0x808080);
			});

			bdd.it('should blend red and green', function () {
				color = Color.blend(new THREE.Color(0xff0000), new THREE.Color(0x00ff00));
				blend = new THREE.Color(0x808000);
			});

			bdd.it('should blend red and blue', function () {
				color = Color.blend(new THREE.Color(0xff0000), new THREE.Color(0x0000ff));
				blend = new THREE.Color(0x800080);
			});

			bdd.it('should blend green and blue', function () {
				color = Color.blend(new THREE.Color(0x00ff00), new THREE.Color(0x0000ff));
				blend = new THREE.Color(0x008080);
			});

		});

		bdd.describe('the luminance method', function () {

			var luminance;

			bdd.after(function () {

				expect(luminance).to.be.an.instanceof(THREE.Color);

				expect(color.r).to.equal(luminance.r);
				expect(color.g).to.equal(luminance.g);
				expect(color.b).to.equal(luminance.b);

				expect(luminance.r).to.be.within(0, 1);
				expect(luminance.g).to.be.within(0, 1);
				expect(luminance.b).to.be.within(0, 1);

			});

			bdd.it('should darken a color', function () {
				color = Color.luminance(new THREE.Color(0xffffff), -1);
				luminance = new THREE.Color(0x000000);
			});

			bdd.it('should lighten a color', function () {
				color = Color.luminance(new THREE.Color(0x000000), 1);
				luminance = new THREE.Color(0xffffff);
			});

		});

	});
});