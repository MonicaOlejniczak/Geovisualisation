define(function () {

	'use strict';

	/**
	 * A function that randomly generates test data.
	 *
	 * @param n The amount of series to generate.
	 * @param [bound] The minimuma and maximum bound for the x and y coordinates.
	 * @return A generated data set.
	 */
	return function (n, bound) {
		// Create an array to store the data.
		var data = [];
		// Specify the minimum and maximum bounds.
		var min = bound !== undefined ? -bound : 100;
		var max = bound !== undefined ? bound : 100;
		// Iterate through the specified amount of series.
		for (var i = 0; i < n; i++) {
			// Create an array to store the series.
			var series = [];
			// Iterate through the series up to 10 times to generate the points.
			for (var j = 0, len = Math.random() * 10; j < len; j++) {
				// Generate a random x and y value between the bounds.
				var x = Math.random() * (max - min) + min;
				var y = Math.random() * (max - min) + min;
				// Add the points to the series.
				series.push([x, y]);
			}
			// Add the series to the data.
			data.push(series);
		}
		// Return the generated data.
		return data;
	};

});