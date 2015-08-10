/**
 * @author Monica Olejniczak
 */
(function () {

	'use strict';

	requirejs.config({
		// Specify the base url to find files.
		baseUrl: '../public/app',
		// Specify the paths.
		paths: {
			app: '.',
			test: '../../test',
			chai: '../bower_components/chai/chai',
			jquery: '../bower_components/jquery/dist/jquery',
			text: '../bower_components/text/text',
			threejs: '../bower_components/threejs/build/three'
		},
		shim: {
			threejs: {exports: 'THREE'}
		}
	});

	mocha.setup('bdd');

	require([
		'test/unit/util/ColorTest',
		'test/unit/util/ConvertTest',
		'test/unit/helper/LightTest'
	], function () {
		mocha.run();
	});

}());
