/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	function Scene () {}

	/**
	 * Creates and returns a grid.
	 *
	 * @param options Configuration options for grid which includes its size, step and color.
	 * @returns {THREE.GridHelper} The grid helper object.
	 */
	Scene.createGrid = function (options) {
		// Obtain the size, step and color from the options or use the default values.
		var size = options.size || 100;
		var step = options.step || 1;
		var color = options.color || 0xffffff;
		// Create the grid helper.
		var grid = new THREE.GridHelper(size, step);
		// Set the color of the grid and then return it.
		grid.setColors(color, color);
		return grid;
	};

	/**
	 * A method for creating the coordinate axes.
	 *
	 * @param [options] The configuration options for the axes.
	 * @returns {THREE.Object3D} The world axes.
	 */
	Scene.createAxes = function (options) {
		// Ensure the options exist.
		options = options || {};
		// Get the origin, target, length and axe colours from the options.
		var origin = options.origin || new THREE.Vector3(0, 0, 0);
		var target = new THREE.Vector3(0, 0, 0);
		var length = options.length || 1000;
		// Get the axes colours and set them.
		var color = options.color || {};
		var xColor = color.x || 0xFF0000;
		var yColor = color.y || 0x00FF00;
		var zColor = color.z || 0x0000FF;
		// Create a container object for the axes.
		var axes = new THREE.Object3D();
		// Build each X, Y and Z axis.
		axes.add(this.createAxis(origin, target.clone().setX(length), xColor, false)); // +X
		axes.add(this.createAxis(origin, target.clone().setX(-length), xColor, true)); // -X
		axes.add(this.createAxis(origin, target.clone().setY(length), yColor, false)); // +Y
		axes.add(this.createAxis(origin, target.clone().setY(-length), yColor, true)); // -Y
		axes.add(this.createAxis(origin, target.clone().setZ(length), zColor, false)); // +Z
		axes.add(this.createAxis(origin, target.clone().setZ(-length), zColor, true)); // -Z
		// Return the axes.
		return axes;
	};

	/**
	 * Creates an axis with a specified origin, target and color.
	 *
	 * @param origin The vector of origin.
	 * @param target The target vector.
	 * @param color The color of the axis.
	 * @param dashed A configuration for whether the axis is a dashed material or not.
	 * @returns {THREE.Line}
	 */
	Scene.createAxis = function (origin, target, color, dashed) {
		// Create the geometry for the axis and define its material.
		var geometry = new THREE.Geometry();
		var material;
		// Check if the axis is being displayed with a dashed material.
		if (dashed) {
			// Create the dashed material.
			material = new THREE.LineDashedMaterial({
				linewidth: 3,
				color: color,
				dashSize: 3,
				gapSize: 3
			});
		} else {
			// Create the basic material.
			material = new THREE.LineBasicMaterial({
				linewidth: 3,
				color: color
			});
		}
		// Add the origin and target vector vertices.
		geometry.vertices.push(origin.clone());
		geometry.vertices.push(target.clone());
		// Compute the distance between the origin and target.
		geometry.computeLineDistances();
		// Return the line representing the axis.
		return new THREE.Line(geometry, material, THREE.LinePieces);
	};

	return Scene;

});
