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
			jquery: '../bower_components/jquery/dist/jquery'
		}
	});

	// Start the main app logic.
	requirejs(['jquery', 'view/concept'], function ($, Concept) {
		var concept = new Concept();
	});

}());
