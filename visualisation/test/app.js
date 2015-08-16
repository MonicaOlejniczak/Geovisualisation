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
			'test': '../../test',
			'chai': '../bower_components/chai/chai',
			'chaiAsPromised': '../bower_components/chai-as-promised/lib/chai-as-promised',
			'sinon': '../bower_components/sinon/lib/sinon',
			'sinon-chai': '../bower_components/sinon-chai/lib/sinon-chai',
			'jquery': '../bower_components/jquery/dist/jquery',
			'text': '../bower_components/text/text',
			'threejs': '../bower_components/threejs/build/three'
		},
		shim: {
			threejs: {exports: 'THREE'}
		}
	});

	mocha.setup('bdd');

	require(['chai', 'chaiAsPromised', 'sinon', 'sinon-chai'], function (chai, chaiAsPromised, sinon, sinonChai) {

		chai.use(chaiAsPromised);
		chai.use(sinonChai);

		require([
			'test/unit/helper/LightTest',
			'test/unit/helper/ShaderTest',
			'test/unit/util/ColorTest',
			'test/unit/util/ConvertTest',
			'test/unit/util/ProjectionTest',
			'test/unit/util/PromisesTest',
			'test/unit/view/points/PointsTest',
			'test/unit/view/points/point/PointTest',
			//'test/unit/SceneRendererTest'
		], function () {
			mocha.run();
		});

	});

}());
