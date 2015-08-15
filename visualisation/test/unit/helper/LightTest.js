define(function (require) {

	'use strict';

	var expect = require('chai').expect;

	var THREE = require('threejs');
	var Light = require('helper/Light');

	describe('the Light module', function () {

		var light;

		describe('the create directional light method', function () {

			var directionalLight;
			var currentOptions, options;

			beforeEach(function () {
				var defaults = Light.options.directional;
				directionalLight = new THREE.DirectionalLight(defaults.color, defaults.intensity);
				directionalLight.target.position.copy(defaults.target);
				// Set the options.
				currentOptions = {};
				options = {
					color: new THREE.Color(0xff0000),
					intensity: 0,
					position: new THREE.Vector3(1, 1, 1),
					target: new THREE.Vector3(1, 1, 1)
				};
			});

			afterEach(function () {
				expect(light.color).to.eql(currentOptions.color || directionalLight.color);
				expect(light.intensity).to.eql(currentOptions.intensity || directionalLight.intensity);
				expect(light.position).to.eql(currentOptions.position || directionalLight.position);
				expect(light.target.position).to.eql(currentOptions.target || directionalLight.target.position);
			});

			it('should create a directional light with default options', function () {
				light = Light.createDirectionalLight();
			});

			it('should create a directional light with a specific colour', function () {
				var color = options.color;
				currentOptions.color = color;
				light = Light.createDirectionalLight({color: color});
			});

			it('should create a directional light with a specific intensity', function () {
				var intensity = options.intensity;
				currentOptions.intensity = intensity;
				light = Light.createDirectionalLight({intensity: intensity});
			});

			it('should create a directional light with a specific position', function () {
				var position = options.position;
				currentOptions.position = position;
				light = Light.createDirectionalLight({position: position});
			});

			it('should create a directional light with a specific target', function () {
				var target = options.target;
				currentOptions.target = target;
				light = Light.createDirectionalLight({target: target});
			});

			it('should create a directional light with all options', function () {

				currentOptions = options;

				light = Light.createDirectionalLight({
					color: options.color,
					intensity: options.intensity,
					position: options.position,
					target: options.target
				});

			});

		});

		describe('the create point light method', function () {

			var pointLight;
			var currentOptions, options;

			beforeEach(function () {
				var defaults = Light.options.point;
				pointLight = new THREE.PointLight(defaults.color, defaults.intensity, defaults.distance);
				// Set the options.
				currentOptions = {};
				options = {
					color: new THREE.Color(0xff0000),
					intensity: 0,
					distance: 1,
					position: new THREE.Vector3(1, 1, 1)
				};
			});

			afterEach(function () {
				expect(light.color).to.eql(currentOptions.color || pointLight.color);
				expect(light.intensity).to.eql(currentOptions.intensity || pointLight.intensity);
				expect(light.distance).to.eql(currentOptions.distance || pointLight.distance);
				expect(light.position).to.eql(currentOptions.position || pointLight.position);
			});

			it('should create a point light with default options', function () {
				light = Light.createPointLight();
			});

			it('should create a point light with a specific colour', function () {
				var color = options.color;
				currentOptions.color = color;
				light = Light.createPointLight({color: color});
			});

			it('should create a point light with a specific intensity', function () {
				var intensity = options.intensity;
				currentOptions.intensity = intensity;
				light = Light.createPointLight({intensity: intensity});
			});

			it('should create a directional light with a specific distance', function () {
				var distance = options.distance;
				currentOptions.distance = distance;
				light = Light.createPointLight({distance: distance});
			});

			it('should create a directional light with a specific position', function () {
				var position = options.position;
				currentOptions.position = position;
				light = Light.createPointLight({position: position});
			});

			it('should create a directional light with all options', function () {

				currentOptions = options;

				light = Light.createPointLight({
					color: options.color,
					intensity: options.intensity,
					distance: options.distance,
					position: options.position
				});

			});

		});

	});
});
