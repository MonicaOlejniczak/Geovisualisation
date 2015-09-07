/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');

	function Convert () {}

	/**
	 * Converts a coordinate into a vector with the correct 3D space.
	 *
	 * @param coordinate The coordinate being transformed.
	 * @returns {THREE.Vector3}
	 */
	Convert.transform = function (coordinate) {
		return new THREE.Vector3(coordinate.x, coordinate.z, coordinate.y);
	};

	/**
	 * Converts spherical coordinates to cartesian.
	 *
	 * @param radius The radial distance.
	 * @param theta The azimuthal angle.
	 * @param phi The polar angle.
	 *
	 * @see https://en.wikipedia.org/wiki/Spherical_coordinate_system
	 *
	 * @returns {THREE.Vector3}
	 */
	Convert.sphericalToCartesian = function (radius, theta, phi) {
		return new THREE.Vector3(
			radius * Math.sin(phi) * Math.sin(theta),
			radius * Math.cos(phi),
			radius * Math.sin(phi) * Math.cos(theta)
		);
	};

	/**
	 * Converts a value from one range to another.
	 *
	 * @param origin The origin range.
	 * @param target The target range.
	 * @param value The value in the origin range.
	 * @returns {*}
	 */
	Convert.convertRange = function (origin, target, value) {
		var ratio = (target.y - target.x) / (origin.y - origin.x);
		return (value - origin.x) * ratio + target.x;
	};

	/**
	 * Calculates the texture coordinates for the geometry. This function has the option of replacing the geometry's
	 * current texture coordinates.
	 *
	 * @param geometry The geometry having its texture coordinates calculated.
	 * @param [replace] Whether the geometry is having its face vertex uvs replaced.
	 */
	Convert.calculateTextureCoordinates = function (geometry, replace) {
		// Compute the bounding box for the geometry.
		geometry.computeBoundingBox();
		// Initialise the variables.
		var boundingBox = geometry.boundingBox,
			max = boundingBox.max,
			min = boundingBox.min,
			offset = new THREE.Vector3(0 - min.x, 0 - min.y, 0 - min.z),
			range = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z),
			vertices = geometry.vertices,
			faces = geometry.faces,
			coordinates = [];
		// Iterate through every face in the geometry.
		faces.forEach(function (face) {
			// Get the vertices from the face.
			var v1 = vertices[face.a],
				v2 = vertices[face.b],
				v3 = vertices[face.c];
			// Append the new texture coordinates.
			coordinates.push([
				new THREE.Vector2((v1.x + offset.x) / range.x, (v1.z + offset.z) / range.z),
				new THREE.Vector2((v2.x + offset.x) / range.x, (v2.z + offset.z) / range.z),
				new THREE.Vector2((v3.x + offset.x) / range.x, (v3.z + offset.z) / range.z)
			]);
		});
		// Replace the face vertex coordinates if it is being replaced.
		if (replace) {
			geometry.faceVertexUvs[0] = coordinates;
		}
	};

	return Convert;

});
