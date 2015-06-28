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
			threejs: '../bower_components/threejs/build/three',
			orbitcontrols: '../bower_components/threejs/build/orbit-controls'
		},
		shim: {
			'threejs': {
				exports: 'THREE'
			}
		}
	});

	// Start the main app logic.
	requirejs(['jquery', 'view/HeatMap'], function ($, HeatMap) {
		var heatMap = new HeatMap($('#visualisation'));
	});

}());
