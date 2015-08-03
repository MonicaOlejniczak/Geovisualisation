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
	//requirejs(['jquery', 'view/heatmap/FlatHeatMap', 'view/Gui'], function ($, FlatHeatMap, Gui) {
	requirejs(['jquery', 'view/heatmap/RoundHeatMap', 'view/Gui'], function ($, FlatHeatMap, Gui) {
		var heatMap = new FlatHeatMap($('#visualisation'));
		var gui = new Gui(heatMap);
	});

}());
