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
			'text': '../bower_components/text/text',
			'json': '../bower_components/requirejs-plugins/src/json',
			'jquery': '../bower_components/jquery/dist/jquery.min',
			'threejs': '../bower_components/threejs/build/three',
			'backbone': '../bower_components/backbone/backbone',
			'underscore': '../bower_components/underscore/underscore',
			'handlebars': '../bower_components/handlebars/handlebars'
		},
		shim: {
			threejs: {exports: 'THREE'},
			backbone: {
				deps: ['jquery', 'underscore'],
				exports: 'Backbone'
			}
		}
	});

	require(['jquery', 'core/Application', 'helper/Handlebars', 'text', 'json'], function ($, Application, HandlebarsHelper, test, json) {
		new HandlebarsHelper();

		var application = window.app = new Application($('#visualisation'));

		//var visualisation = application.loadCuboid();
		//var visualisation = application.loadGlobe();
		var visualisation = application.loadGrid();

		application.render();

	});

}());
