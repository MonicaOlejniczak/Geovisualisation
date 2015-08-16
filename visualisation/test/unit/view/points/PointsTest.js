define(function (require) {

	'use strict';

	var expect = require('chai').expect;
	var sinon = require('sinon');

	var THREE = require('threejs');

	var Points = require('view/points/Points');
	var Point = require('view/points/point/Point');

	describe('the Points module', function () {

		var points;

		beforeEach(function () {
			points = new Points();
		});

		describe('the constructor', function () {

			it('should set the width of the points when specified', function () {
				var width = 2.5;
				points = new Points({width: width});
				expect(points.width).to.equal(width);
			});

			it('should set the height of the points when specified', function () {
				var height = 2.5;
				points = new Points({height: height});
				expect(points.height).to.equal(height);
			});

			it('should set the shader path when specified', function () {
				var shaderPath = 'test/mock/shader/basic/Basic';
				points = new Points({shaderPath: shaderPath});
				expect(points.shaderPath).to.equal(shaderPath);
			});

		});

		describe('the add point method', function () {

			var data, length;

			beforeEach(function () {
				data = [1, 1, 1];
				length = 10;
			});

			it('should return a Point', function () {
				expect(points.addPoint(data)).to.be.an.instanceOf(Point);
			});

			it('should add a point to the points array of the type Point', function () {
				points.addPoint(data);
				expect(points._points[0]).to.be.an.instanceOf(Point);
			});

			it('should add a point to the points array', function () {
				points.addPoint(data);
				expect(points._points).to.have.length(1);
			});

			it('should add multiple points to the points array', function () {
				for (var i = 0, len = length; i < len; i++) {
					points.addPoint(data);
				}
				expect(points._points).to.have.length(length);
			});

			it('should set the global max given multiple points', function () {
				for (var i = 1, len = length; i <= len; i++) {
					points.addPoint([i, i, i]);
				}
				expect(points.getMax()).to.equal(length);
			});

		});

		//describe('the update method', function () {

			//var stub;

			//beforeEach(function () {
			//	stub = sinon.stub(points, '_updatePoints');
			//});

			// TODO
			//it('should call the update points method', function () {
			//	points.update();
			//	expect(stub).to.eventually.be.calledOnce;
			//});

		//});

		describe('the update points method', function () {

			var stub, length;

			beforeEach(function () {

				stub = sinon.stub(points, '_updatePoint', function () {
					return new Point([1, 1, 1]);
				});

				length = 10;
				for (var i = 0, len = length; i < len; i++) {
					points.addPoint([i, i, i]);
				}

				points._updatePoints();

			});

			it('should iterate through and update each point', function () {
				expect(stub).to.have.callCount(length);
			});

			it('should have the same amount of children as there are points', function () {
				expect(points.children).to.have.length(length);
			});

		});

		describe('the update point method', function () {

			var point, positionStub, materialStub;

			beforeEach(function () {
				point = points.addPoint([1, 1, 1]);
				positionStub = sinon.stub(point, 'updatePosition');
				materialStub = sinon.stub(point, 'updateMaterial');
			});

			it('should call the update position method', function () {
				points._updatePoint(point);
				expect(positionStub).to.have.been.calledOnce;
			});

			it('should call the update material method', function () {
				points._updatePoint(point);
				expect(materialStub).to.have.been.calledOnce;
			});

			it('should return the point', function () {
				expect(points._updatePoint(point)).to.equal(point);
			});

		});

	});

});
