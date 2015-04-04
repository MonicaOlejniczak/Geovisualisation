/**
 * @author Monica Olejniczak
 */
(function () {

	'use strict';

	requirejs.config({
		// Specify the paths.
		paths: {
			jquery: '../bower_components/jquery/dist/jquery',
			threejs: '../bower_components/threejs/build/three'
		},
		shim: {
			'threejs': {
				exports: 'THREE'
			}
		}
	});

	// Start the main app logic.
	requirejs(['jquery', 'app/visualisation'], function ($, Visualisation) {
		var visualisation = new Visualisation($('#visualisation'));
	});

}());
