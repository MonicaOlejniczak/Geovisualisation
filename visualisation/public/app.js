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
			threejs: '../bower_components/threejs/build/three'
		},
		shim: {
			threejs: {exports: 'THREE'}
		}
	});

	// Start the main app logic.
	//requirejs(['jquery', 'view/heatmap/FlatHeatMap', 'view/Gui'], function ($, FlatHeatMap, Information, Gui) {
	requirejs(['jquery', 'view/heatmap/RoundHeatMap', 'view/points/information/Information', 'view/Gui'], function ($, FlatHeatMap, Information, Gui) {
		var canvas = $('#visualisation');
		var heatMap = new FlatHeatMap(canvas);
		var information = new Information(canvas, heatMap.renderer.raycaster);
		var gui = new Gui(heatMap);
	});

}());
