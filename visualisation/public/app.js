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
			'jquery': '../bower_components/jquery/dist/jquery.min',
			'text': '../bower_components/text/text',
			'threejs': '../bower_components/threejs/build/three',
			'handlebars': '../bower_components/handlebars/handlebars'
		},
		shim: {
			threejs: {exports: 'THREE'}
		}
	});

	// Start the main app logic.
	require(['jquery', 'view/heatmap/FlatHeatMap', 'view/points/information/Information', 'view/Gui'], function ($, FlatHeatMap, Information, Gui) {
	//require(['jquery', 'view/heatmap/RoundHeatMap', 'view/points/information/Information', 'view/Gui'], function ($, FlatHeatMap, Information, Gui) {
		var heatMap = new FlatHeatMap($('#visualisation'));
		var information = new Information(heatMap.renderer, heatMap.points);
		var gui = new Gui(heatMap);

		var sliders = $('#filters .slider');

		sliders.each(function (index, slider) {
			noUiSlider.create(slider, {
				start: 50,
				connect: "lower",
				range: {
					min: 0,
					max: 100
				}
			});
		});

	});

}());
