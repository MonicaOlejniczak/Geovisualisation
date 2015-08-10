define(function (require) {

	'use strict';

	var expect = require('chai').expect;

	var THREE = require('threejs');
	var Shader = require('app/helper/Shader');

	var BasicVertexShader = require('text!test/mock/Shader/Basic.vert');
	var BasicFragmentShader = require('text!test/mock/Shader/Basic.frag');

	describe('the Shader module', function () {

		var shader;
		var basePath, path;

		beforeEach(function () {
			basePath = 'test/mock/shader/';
			path = 'Basic';
		});

		describe('the constructor', function () {

			it('should be able to set a base path', function () {
				shader = new Shader(path, {basePath: basePath});
				expect(shader).to.have.property('basePath', basePath);
			});

			it('should be able to set uniforms', function () {
				var uniforms = {uTest: {type: 'i', value: 1}};
				shader = new Shader(path, {basePath: basePath, uniforms: uniforms});
				expect(shader).to.have.property('uniforms', uniforms);
			});

		});

		describe('the get path method', function () {

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
			});

			it('should retrieve the default path', function () {
				expect(shader._getPath()).to.equal('text!' + basePath + path);
			});

			it('should retrieve a passed in path', function () {
				path = 'new path';
				expect(shader._getPath(path)).to.equal('text!' + basePath + path);
			});

		});

		describe('the load shaders method', function () {

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
			});

			it('should load the vertex and fragment shader', function () {
				expect(shader._loadShaders(shader.path)).to.eventually.eql([BasicVertexShader, BasicFragmentShader]);
			});

		});

		describe('the load shader method', function () {

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
			});

			it('should update the vertex shader', function () {
				var name = 'vertex';
				var shaderPath = shader._getPath() + '.vert';
				var value = shader[name];
				return shader._loadShader(name, shaderPath).then(function () {
					expect(shader).to.have.property(name).not.equal(value);
				});
			});

			it('should update the fragment shader', function () {
				var name = 'fragment';
				var shaderPath = shader._getPath() + '.frag';
				var value = shader[name];
				return shader._loadShader(name, shaderPath).then(function () {
					expect(shader).to.have.property(name).not.equal(value);
				});
			});

		});

		describe('the resolve includes method', function () {

			it('should call the load includes method', function() {

			});

		})

	});
});
