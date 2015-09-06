define(function () {

	'use strict';

	/**
	 * A function that randomly generates test data.
	 *
	 * @param n The amount of points to generate.
	 * @param bound The minimum and maximum bound for the coordinates.
	 * @return A generated data set.
	 */
	return function (n, bound) {
		// Create an array to store the data.
		var data = [];
		// Get each coordinate bound.
		var xBound = bound.x;
		var yBound = bound.y;
		var zBound = bound.z;
		// Iterate through the series up to 10 times to generate the points.
		for (var j = 0, len = n; j < len; j++) {
			// Generate a random x and y value between the bounds.
			var x = (Math.random() * (xBound.y - xBound.x) + xBound.x);
			var y = (Math.random() * (yBound.y - yBound.x) + yBound.x);
			var z = (Math.random() * (zBound.y - zBound.x) + zBound.x);
			// Add the data to the array.
			data.push({x: x, y: y, z: z});
		}
		// Return the generated data.
		return data;
	};

});