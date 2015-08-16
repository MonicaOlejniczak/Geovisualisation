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
			handlebars: '../bower_components/handlebars/handlebars'
		},
		shim: {
			threejs: {exports: 'THREE'}
		}
	});

	// Start the main app logic.
	//requirejs(['jquery', 'view/heatmap/FlatHeatMap', 'view/Gui'], function ($, FlatHeatMap, Information, Gui) {
	requirejs(['jquery', 'view/heatmap/RoundHeatMap', 'view/points/information/Information', 'view/Gui'], function ($, FlatHeatMap, Information, Gui) {
		var heatMap = new FlatHeatMap($('#visualisation'));
		var information = new Information(heatMap.renderer);
		var gui = new Gui(heatMap);
	});

}());
