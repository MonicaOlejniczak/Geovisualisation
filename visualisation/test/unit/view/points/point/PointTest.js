define(function (require) {

	'use strict';

	var expect = require('chai').expect;
	var sinon = require('sinon');

	var THREE = require('threejs');

	var Point = require('view/points/point/Point');
	var Points = require('view/points/Points');
	var Projection = require('util/Projection');
	var Convert = require('util/Convert');

	var VertexShader = require('text!test/mock/shader/Basic/basic.vert');
	var FragmentShader = require('text!test/mock/shader/Basic/basic.frag');

	describe('the Point module', function () {

		var point, data;

		beforeEach(function () {
			data = [1, 2, 3];
		});

		describe('constructor', function () {

			it('should call the update position method', function () {
				var stub = sinon.spy(Point.prototype, 'updatePosition');
				point = new Point(data, 1, 1);
				expect(stub).to.have.been.calledOnce;
			});

		});

		describe('update position method', function () {

			var position;

			beforeEach(function () {
				point = new Point(data, 1, 1);
				position = new THREE.Vector3(1, 1, 1);
			});

			it('should update the position of the point', function () {
				point.updatePosition(position);
				expect(point.position).to.eql(position);
			});

			it('should not call the project method when a projection has not been passed in', function () {
				var projection = new Projection(Projection.standard);
				var stub = sinon.stub(projection, 'project');
				point.updatePosition(position);
				expect(stub).to.not.have.been.called;
			});

			it('should call the project method when a projection has been passed in', function () {
				var projection = new Projection(Projection.standard);
				var stub = sinon.stub(projection, 'project');
				point.updatePosition(position, projection);
				expect(stub).to.have.been.calledOnce;
			});

		});

		describe('update material method', function () {

			var material, options;

			beforeEach(function () {
				point = new Point(data, 1, 1);
				material = new THREE.ShaderMaterial({
					vertex: VertexShader,
					fragment: FragmentShader
				});
				options = new Points().getOptions();
			});

			it('should update the material of the mesh', function () {
				var pointMaterial = point.material;
				point.updateMaterial(material, options.mode, options.colors, options.bound, options.colorRange);
				expect(point.material).to.not.equal(pointMaterial);
			});

			it('should update the material uniforms of the mesh', function () {
				var uniforms = point.material.uniforms;
				point.updateMaterial(material, options.mode, options.colors, options.bound, options.colorRange);
				expect(point.material.uniforms).to.not.eql(uniforms);
			});

		});

	});

});
