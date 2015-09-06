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

	require(['Application'], function (Application) {
		new Application();
	});

}());
