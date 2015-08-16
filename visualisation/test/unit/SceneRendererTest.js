define(function (require) {

	'use strict';

	var expect = require('chai').expect;
	var sinon = require('sinon');

	var $ = require('jquery');
	var THREE = require('threejs');

	var SceneRenderer = require('SceneRenderer');
	var Viewport = require('Viewport');
	var SceneHelper = require('helper/Scene');
	var MouseControls = require('controls/Mouse');
	var Raycaster = require('controls/Raycaster');

	describe('the SceneRenderer module', function () {

		var sceneRenderer, canvas;

		before(function () {
			canvas = $('<canvas>').get(0);
		});

		describe('the constructor', function () {

			it('should set the canvas', function () {
				sceneRenderer = new SceneRenderer(canvas);
				expect(sceneRenderer._canvas).to.equal(canvas);
			});

			it('should create a scene', function () {
				sceneRenderer = new SceneRenderer(canvas);
				expect(sceneRenderer._scene).to.be.an.instanceOf(THREE.Scene);
			});

			it('should create a camera', function () {
				sceneRenderer = new SceneRenderer(canvas);
				expect(sceneRenderer._camera).to.be.an.instanceOf(THREE.Camera);
			});

			it('should set the position of the camera when specified', function () {
				var position = new THREE.Vector3(1, 1, 1);
				sceneRenderer = new SceneRenderer(canvas, {camera: {position: position}});
				expect(sceneRenderer._camera.position).to.eql(position);
			});

			it('should set the up vector of the camera when specified', function () {
				var up = new THREE.Vector3(1, 0, 0);
				sceneRenderer = new SceneRenderer(canvas, {camera: {up: up}});
				expect(sceneRenderer._camera.up).to.eql(up);
			});

			it('should create a WebGL renderer', function () {
				sceneRenderer = new SceneRenderer(canvas);
				expect(sceneRenderer.renderer).to.be.an.instanceOf(THREE.WebGLRenderer);
			});

			it('should set the canvas of the WebGL renderer', function () {
				sceneRenderer = new SceneRenderer(canvas);
				expect(sceneRenderer.renderer.domElement).to.equal(canvas);
			});

			it('should create a grid when specified', function () {
				var stub = sinon.stub(SceneHelper, 'createGrid').returns(new THREE.Object3D());
				sceneRenderer = new SceneRenderer(canvas, {grid: true});
				expect(stub).to.have.been.calledOnce;
			});

			it('should create axes when specified', function () {
				var stub = sinon.stub(SceneHelper, 'createAxes').returns(new THREE.Object3D());
				sceneRenderer = new SceneRenderer(canvas, {axes: true});
				expect(stub).to.have.been.calledOnce;
			});

			it('should create mouse controls when specified', function () {
				sceneRenderer = new SceneRenderer(canvas, {mouseControls: true});
				expect(sceneRenderer.controls).to.be.an.instanceOf(MouseControls);
			});

			it('should create a raycaster when specified', function () {
				sceneRenderer = new SceneRenderer(canvas, {raycaster: true});
				expect(sceneRenderer.raycaster).to.be.an.instanceOf(Raycaster);
			});

		});

		describe('the resize method', function () {

			var stub;

			beforeEach(function () {
				sceneRenderer = new SceneRenderer(canvas);
				sceneRenderer.renderer.setSize(Viewport.getWidth(), Viewport.getHeight());
				stub = sinon.stub(sceneRenderer, '_resize');
			});

			it('should call the internal resize method when the viewport width has changed', function () {
				canvas.width = canvas.width + 1;
				sceneRenderer.resize();
				expect(stub).to.have.been.calledOnce;
			});

			it('should call the internal resize method when the viewport height has changed', function () {
				canvas.height = canvas.height + 1;
				sceneRenderer.resize();
				expect(stub).to.have.been.calledOnce;
			});

			it('should call the internal resize method when the viewport width and height have changed', function () {
				canvas.width = canvas.width + 1;
				canvas.height = canvas.height + 1;
				sceneRenderer.resize();
				expect(stub).to.have.been.calledOnce;
			});

			it('should call the internal resize method with the viewport width and height', function () {
				var width = Viewport.getWidth();
				var height = Viewport.getHeight();
				canvas.width = canvas.width + 1;
				sceneRenderer.resize();
				expect(stub).to.have.been.calledWith(width, height);

			});

		});

		describe('the internal resize method', function () {

			var width, height;

			beforeEach(function () {
				sceneRenderer = new SceneRenderer(canvas);
				width = canvas.width + 1;
				height = canvas.height + 1;
			});

			it('should set the aspect ratio of the camera to be a ratio of the width and height', function () {
				sceneRenderer._resize(width, height);
				expect(sceneRenderer._camera.aspect).to.equal(width / height);
			});

		});

		describe('the render method', function () {

			var animationFrame, raycast;

			beforeEach(function () {
				animationFrame = sinon.stub(window, 'requestAnimationFrame');
				raycast = sinon.stub(Raycaster.prototype, 'update');
			});

			afterEach(function () {
				animationFrame.restore();
				raycast.restore();
			});

			it('should call request animation frame', function () {
				sceneRenderer = new SceneRenderer(canvas);
				sceneRenderer.render();
				expect(animationFrame).to.have.been.calledOnce;
			});

			it('should call the resize method', function () {
				sceneRenderer = new SceneRenderer(canvas);
				var stub = sinon.stub(sceneRenderer, 'resize');
				sceneRenderer.render();
				expect(stub).to.have.been.calledOnce;
			});

			it('should not call the raycaster update method when it does not exist', function () {
				sceneRenderer = new SceneRenderer(canvas);
				sceneRenderer.render();
				expect(raycast).to.not.have.been.called;
			});

			it('should call the raycaster update method when it exists', function () {
				sceneRenderer = new SceneRenderer(canvas, {raycaster: true});
				sceneRenderer.render();
				expect(raycast).to.have.been.calledOnce;
			});

			it('should call the renderer render method with the scene and camera', function () {
				sceneRenderer = new SceneRenderer(canvas);
				var scene = sceneRenderer._scene;
				var camera = sceneRenderer._camera;
				var stub = sinon.stub(sceneRenderer.renderer, 'render');
				sceneRenderer.render();
				expect(stub).to.have.been.calledWith(scene, camera);
			});

		});

	});

});
