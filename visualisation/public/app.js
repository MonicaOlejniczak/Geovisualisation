/**
 * @author Monica Olejniczak
 */
(function () {

	'use strict';

	requirejs.config({
		// Specify the base url to find files.
		baseUrl: 'app',
		// Specify the paths.
		paths: {
			jquery: '../bower_components/jquery/dist/jquery',
			text: '../bower_components/text/text',
			threejs: '../bower_components/threejs/build/three',
			orbitcontrols: '../bower_components/threejs/build/orbit-controls',
			bluebird: '../bower_components/bluebird/js/browser/bluebird'
		},
		shim: {
			'threejs': {
				exports: 'THREE'
			}
		}
	});

	// Start the main app logic.
	requirejs(['jquery', 'bluebird', 'view/HeatMap'], function ($, Bluebird, HeatMap) {
		var heatMap = new HeatMap($('#visualisation'));
	});

}());
