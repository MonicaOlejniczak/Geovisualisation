define(function (require) {

	'use strict';

	var expect = require('chai').expect;
	var sinon = require('sinon');

	var THREE = require('threejs');
	var Shader = require('helper/Shader');

	var BasicVertexShader = require('text!test/mock/Shader/basic/Basic.vert');
	var BasicFragmentShader = require('text!test/mock/Shader/basic/Basic.frag');

	var NoInclude = require('text!test/mock/Shader/includes/None.h');
	var OneInclude = require('text!test/mock/Shader/includes/One.h');
	var MultiInclude = require('text!test/mock/Shader/includes/Multi.h');

	describe('the Shader module', function () {

		var shader;
		var basePath, path;

		beforeEach(function () {
			basePath = 'test/mock/shader/';
			path = 'basic/Basic';
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

		describe('the load method', function () {

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
			});

			it('should call the load shaders method', function () {
				var stub = sinon.stub(shader, '_loadShaders').returns(Promise.resolve());
				shader.load();
				expect(stub).to.have.been.calledOnce;
			});

			it('should call the create material method', function () {
				var stub = sinon.stub(shader, '_createMaterial');
				// TODO
				shader.load().then(function () {
					expect(stub).to.have.been.calledOnce;
				});
				//debugger;
				//return expect(stub).to.eventually.be.calledOnce;
			});

			it('should eventually be fulfilled', function () {
				return expect(shader.load()).to.eventually.be.fulfilled;
			})

		});

		describe('the get path method', function () {

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
			});

			it('should retrieve the default path', function () {
				expect(shader.getPath()).to.equal('text!' + basePath + path);
			});

			it('should retrieve a passed in path', function () {
				path = 'new path';
				expect(shader.getPath(path)).to.equal('text!' + basePath + path);
			});

		});

		describe('the load shaders method', function () {

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
			});

			it('should load the vertex and fragment shader', function () {
				return expect(shader._loadShaders(shader.path)).to.eventually.eql([BasicVertexShader, BasicFragmentShader]);
			});

			it('should eventually be fulfilled', function () {
				return expect(shader._loadShaders(shader.path)).to.eventually.be.fulfilled;
			})

		});

		describe('the load shader method', function () {

			var args;

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
				args = {
					vertex: {
						name: 'vertex',
						path: shader.getPath() + '.vert'
					},
					fragment: {
						name: 'fragment',
						path: shader.getPath() + '.frag'
					}
				};
			});

			it('should update the vertex shader', function () {
				var vertex = args.vertex;
				var name = vertex.name;
				var value = shader[name];
				return shader._loadShader(name, vertex.path).then(function () {
					expect(shader).to.have.property(name).not.equal(value);
				});
			});

			it('should update the fragment shader', function () {
				var fragment = args.fragment;
				var name = fragment.name;
				var value = shader[name];
				return shader._loadShader(name, fragment.path).then(function () {
					expect(shader).to.have.property(name).not.equal(value);
				});
			});

			it('should eventually be fulfilled', function () {
				var vertex = args.vertex;
				expect(shader._loadShader(vertex.name, vertex.path)).to.eventually.be.fulfilled;
			});

		});

		describe('the get includes method', function () {

			var includes, result;

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
				result = ['#include "1"', '#include "2"', '#include "3"'];
			});

			it('should not match an include when it is not preceeded by a #', function () {
				includes = 'include "0"; other text #include "1"; #include "2"; other text #include "3";';
				expect(shader._getIncludes(includes)).to.eql(result);
			});

			it('should return includes that are on the same line', function () {
				includes = 'other text #include "1"; #include "2"; other text #include "3";';
				expect(shader._getIncludes(includes)).to.eql(result);
			});

			it('should return includes that are surrounded by tabbed whitespace', function () {
				includes = 'other text      #include "1";   #include "2";     other text          #include "3";';
				expect(shader._getIncludes(includes)).to.eql(result);
			});

			it('should return includes that are on multiple lines', function () {
				includes = 'other text      #include "1";\n   #include "2";     other text     \n     #include "3";';
				expect(shader._getIncludes(includes)).to.eql(result);
			});

			// Should not return includes that are commented out

		});

		describe('the resolve includes method', function () {

			var stub;

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
				stub = sinon.stub(shader, '_loadIncludes');
			});

			it('should not call the load includes method when there are no includes', function() {
				shader._resolveIncludes(NoInclude, 'none');
				expect(stub).to.not.have.been.called;
			});

			it('should call the load includes method when there is one include', function () {
				shader._resolveIncludes(OneInclude, 'one');
				expect(stub).to.have.been.calledOnce;
			});

			it('should call the load includes method when there is more than one include', function () {
				shader._resolveIncludes(MultiInclude, 'multi');
				expect(stub).to.have.been.calledOnce;
			});

		});

		// TODO later
		// describe('the load includes method', function () {
		//
		//	beforeEach(function () {
		//		shader = new Shader(path, {basePath: basePath});
		//	});
		//
		//	it('should eventually be fulfilled', function () {
		//		var includes = shader._getIncludes(MultiInclude);
		//		expect(shader._loadIncludes(includes, 'vertex')).to.eventually.be.fulfilled;
		//	});
		//
		//});

		describe('the create material method', function () {

			var uniforms, vertexShader, fragmentShader;

			beforeEach(function () {
				shader = new Shader(path, {basePath: basePath});
				uniforms = {uTest: {type: 'i', value: 1}};
				vertexShader = BasicVertexShader;
				fragmentShader = BasicFragmentShader;
			});

			it('should update the material of the shader', function () {
				var material = shader.material;
				shader._createMaterial(uniforms, vertexShader, fragmentShader);
				expect(shader.material).to.not.equal(material);
			});

			it('should create a shader material with the specified uniforms, vertex and fragment shader', function () {
				shader._createMaterial(uniforms, vertexShader, fragmentShader);
				var material = shader.material;
				expect(material.uniforms).to.eql(uniforms);
				expect(material.vertexShader).to.eql(vertexShader);
				expect(material.fragmentShader).to.eql(fragmentShader);
			});

		});

	});
});
