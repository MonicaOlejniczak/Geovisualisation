define(function (require) {

	'use strict';

	var expect = require('chai').expect;
	var sinon = require('sinon');

	var THREE = require('threejs');

	var Projection = require('util/Projection');

	describe('the Projection module', function () {

		var projection, options;

		beforeEach(function () {
			projection = Projection.standard;
			options = {
				target: new THREE.Vector3(1, 1, 1),
				offset: 10,
				radius: 10
			}
		});

		describe('the constructor', function () {

			it('should set the projection', function () {
				expect(new Projection(projection).projection).to.equal(projection);
			});

			it('should set the target when specified', function () {
				var target = options.target;
				expect(new Projection(projection, {target: target}).target).to.equal(target);
			});

			it('should set the offset when specified', function () {
				var offset = options.offset;
				expect(new Projection(projection, {offset: offset}).offset).to.equal(offset);
			});

			it('should set the radius when specified', function () {
				var radius = options.radius;
				expect(new Projection(projection, {radius: radius}).radius).to.equal(radius);
			});

			it('should be able to set all the options', function () {
				projection = new Projection(projection, options);
				expect(projection.target).to.equal(options.target);
				expect(projection.offset).to.equal(options.offset);
				expect(projection.radius).to.equal(options.radius);
			});

		});

		describe('the project method', function () {

			var stub;

			it('should call the projection function', function () {
				projection = new Projection(projection);
				stub = sinon.stub(projection, 'projection');
				projection.project();
				expect(stub).to.have.been.calledOnce;
			});

			it('should call the projection function with the specified arguments', function () {
				var object = new THREE.Mesh();
				var offset = 10;
				projection = new Projection(projection);
				stub = sinon.stub(projection, 'projection');
				projection.project(object, offset);
				expect(stub).to.have.been.calledWith(object, offset);
			});

		});

		describe('the standard projection method', function () {

			var object, offset, position;

			beforeEach(function () {
				object = new THREE.Mesh();
				offset = 10;
				position = new THREE.Vector3(0, offset, 0);
			});

			it('should translate the object by the specified offset', function () {
				Projection.standard(object, offset);
				expect(object.position).to.eql(position);
			});

			it('should use the offset in the instance if it is not passed in', function () {
				projection = new Projection(projection, {offset: offset});
				projection.project(object);
				expect(object.position).to.eql(position);
			});

		});

		// TODO
		//describe('the spherical projection method', function () {
		//
		//	it('should ')
		//
		//});

	});

});
