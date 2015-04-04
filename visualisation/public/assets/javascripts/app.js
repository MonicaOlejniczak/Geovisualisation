/**
 * @author Monica Olejniczak
 */
(function () {

	'use strict';

	requirejs.config({
		// Load standard javascript files in the specified directory.
		baseUrl: 'assets/javascripts',
		// Indicate the namespace.
		namespace: 'app',
		// Specify the paths.
		paths: {
			app: 'app',
			jquery: '../../bower_components/jquery/dist/jquery',
			threejs: '../../bower_components/threejs/build/three'
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
