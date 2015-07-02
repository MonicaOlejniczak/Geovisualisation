define(function () {

	'use strict';

	/**
	 * A function that randomly generates test data.
	 *
	 * @param n The amount of points to generate.
	 * @param [bound] The minimum and maximum bound for the x and y coordinates.
	 * @return A generated data set.
	 */
	return function (n, bound) {
		// Create an array to store the data.
		var data = [];
		var height = 100;
		// Specify the minimum and maximum bounds.
		var min = bound !== undefined ? -bound : height;
		var max = bound !== undefined ? bound : height;
		// Iterate through the series up to 10 times to generate the points.
		for (var j = 0, len = n; j < len; j++) {
			// Generate a random x and y value between the bounds.
			var x = Math.random() * (max - min) + min;
			var y = Math.random() * (max - min) + min;
			var z = Math.random() * (max - min) + min;
			// Add the data to the array.
			data.push([x, y, z]);
		}
		// Return the generated data.
		return data;
	};

});