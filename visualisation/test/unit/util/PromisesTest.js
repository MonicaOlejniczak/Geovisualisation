define(function (require) {

	'use strict';

	var expect = require('chai').expect;
	var sinon = require('sinon');

	var Promises = require('app/util/Promises');
	var RequirePromise = require('test/mock/promise/Require');

	describe('the Promises module', function () {

		describe('the require promise method', function () {

			var path;

			beforeEach(function () {
				path = 'test/mock/promise/Require';
			});

			it('should eventually be fulfilled', function () {
				expect(Promises.requirePromise(path)).to.eventually.be.fulfilled;
			});

			it('should return the module given its path', function () {
				return expect(Promises.requirePromise(path)).to.eventually.equal(RequirePromise);
			});

		});

	});

});
