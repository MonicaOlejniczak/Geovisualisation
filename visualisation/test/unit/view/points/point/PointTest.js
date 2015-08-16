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
			point = new Point(data, 1, 1);
		});

		describe('the update position method', function () {

			it('should update the position to equal the transformed point data', function () {
				point.updatePosition();
				expect(point.position).to.eql(Convert.transform(data[0], data[1], data[2]));
			});

			it('should call the project method on a projection when it is passed in', function () {
				var projection = new Projection(Projection.standard);
				var stub = sinon.stub(projection, 'project');
				point.updatePosition(projection);
				expect(stub).to.have.been.calledOnce;
			});

		});

		describe('the update material method', function () {

			var material, options;

			beforeEach(function () {
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
