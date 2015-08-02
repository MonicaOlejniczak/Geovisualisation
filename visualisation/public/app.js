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
			orbitcontrols: '../bower_components/threejs/build/orbit-controls'
		},
		shim: {
			threejs: {exports: 'THREE'}
		}
	});

	// Start the main app logic.
	requirejs(['jquery', 'view/heatmap/RoundHeatMap'], function ($, FlatHeatMap) {
		var gui = new dat.GUI();
		var heatMap = new FlatHeatMap($('#visualisation'));
		$(heatMap.surface).on({
			load: function (event, material) {
				var uniforms = material.uniforms;
				gui.add(uniforms.uRedShift, 'value', -100, 100).name('Red');
				gui.add(uniforms.uGreenShift, 'value', -100, 100).name('Green');
				gui.add(uniforms.uBlueShift, 'value', -100, 100).name('Blue');
			}
		});

	});

}());
