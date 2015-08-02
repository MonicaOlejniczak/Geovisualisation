/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var THREE = require('threejs');
	var Convert = require('util/Convert');

	/**
	 * Initialises the GUI controls.
	 *
	 * @param visualisation The visualisation associated with the GUI controls.
	 * @constructor
	 */
	function Gui (visualisation) {
		this.configure(new dat.GUI(), visualisation);
	}

	/**
	 * Configures the GUI given the instance of the controls and the visualisation.
	 *
	 * @param gui The GUI controls.
	 * @param visualisation The visualisation associated with the GUI controls.
	 */
	Gui.prototype.configure = function (gui, visualisation) {
		this._configureSurface(gui, visualisation);
		this._configurePoints(gui, visualisation.points);
	};

	/**
	 * Configures the surface.
	 *
	 * @param gui The GUI controls.
	 * @param visualisation The visualisation associated with the GUI controls.
	 * @private
	 */
	Gui.prototype._configureSurface = function (gui, visualisation) {
		var surface = visualisation.surface;
		// Create a folder for the surface colour.
		var folder = gui.addFolder('Surface');
		$(surface).on({
			load: function (event, material) {
				// Get the colour bound and its min and max values.
				var colourBound = surface.colorBound;
				var min = colourBound.x;
				var max = colourBound.y;
				// Get the material uniforms.
				var uniforms = material.uniforms;
				// Add the colour shfit values.
				folder.add(uniforms.uRedShift, 'value').min(min).max(max).name('Red');
				folder.add(uniforms.uGreenShift, 'value').min(min).max(max).name('Green');
				folder.add(uniforms.uBlueShift, 'value').min(min).max(max).name('Blue');
			},
			clouds: function (event, clouds) {
				folder.add(clouds.material, 'opacity').min(0).max(1).name('Clouds');
			},
			atmosphere: function (event, atmosphere) {
				var uniforms = atmosphere.material.uniforms;
				folder.addColor(uniforms.uColor, 'value').name('Atmosphere').onChange(this._onAtmosphere.bind(this, atmosphere));
			}.bind(this)
		});
	};

	/**
	 * Configures the points.
	 *
	 * @param gui The GUI controls.
	 * @param points The points associated with the visualisation.
	 * @private
	 */
	Gui.prototype._configurePoints = function (gui, points) {
		this._configureBasicShader(gui, points);
		this._configureGradientShader(gui, points);
	};

	/**
	 * Configures the basic shader controls.
	 *
	 * @param gui The GUI controls.
	 * @param points The points associated with the visualisation.
	 * @private
	 */
	Gui.prototype._configureBasicShader = function (gui, points) {
		// Create a folder for the basic shader.
		var folder = gui.addFolder('Basic configuration');
		// Get the color range.
		var colorRange = points.colorRange;
		// Get the min and max bounds of the color range.
		var bound = colorRange.bound;
		var min = bound.x;
		var max = bound.y;
		// Get the range of colors available.
		var range = colorRange.range;
		// Add the minimum and maximum widgets to the folder.
		folder.add(range, 'x').min(min).max(max).name('Minimum');
		folder.add(range, 'y').min(min).max(max).name('Maximum');
		// Open the folder.
		folder.open();
	};

	/**
	 * Converts a colour object of the form {r, g, b} to a THREE.js colour.
	 *
	 * @param color The colour being converted.
	 * @returns {THREE.Color} The converted colour.
	 * @private
	 */
	Gui.prototype._convertColor = function (color) {
		// Set the origin and target vectors for the colour ranges.
		var origin = new THREE.Vector2(0, 255);
		var target = new THREE.Vector2(0, 1);
		// Convert the RGB values to be within the target range.
		var r = Convert.convertRange(origin, target, color.r);
		var g = Convert.convertRange(origin, target, color.g);
		var b = Convert.convertRange(origin, target, color.b);
		// Return the value of the converted colour.
		return new THREE.Color(r, g, b);
	};

	/**
	 * Configures a color given the objects, color and uniform key.
	 *
	 * @param objects The list of objects that contain a mesh.
	 * @param color The new colour of the objects.
	 * @param key The key for the material uniform.
	 * @private
	 */
	Gui.prototype._configureColor = function (objects, color, key) {
		// Convert the colour to a THREE.js colour.
		color = this._convertColor(color);
		// Iterate through each object and update their shader material uniform.
		$(objects).each(function (index, object) {
			var material = object.mesh.material;
			material.uniforms[key].value = color;
		}, this);
	};

	Gui.prototype._onAtmosphere = function (atmosphere, color) {
		var material = atmosphere.material;
		material.uniforms['uColor'].value = this._convertColor(color);
	};

	/**
	 * An event triggered when the low colour controls have changed.
	 *
	 * @param points The points associated with the colour change.
	 * @param color The new colour of the objects.
	 * @private
	 */
	Gui.prototype._onLowColor = function (points, color) {
		this._configureColor(points._points, color, 'uLowColor');
	};

	/**
	 * An event triggered when the medium colour controls have changed.
	 *
	 * @param points The points associated with the colour change.
	 * @param color The new colour of the objects.
	 * @private
	 */
	Gui.prototype._onMediumColor = function (points, color) {
		this._configureColor(points._points, color, 'uMediumColor');
	};

	/**
	 * An event triggered when the high colour controls have changed.
	 *
	 * @param points The points associated with the colour change.
	 * @param color The new colour of the objects.
	 * @private
	 */
	Gui.prototype._onHighColor = function (points, color) {
		this._configureColor(points._points, color, 'uHighColor');
	};

	/**
	 * Configures the gradient shader controls.
	 *
	 * @param gui The GUI controls.
	 * @param points The points associated with the visualisation.
	 * @private
	 */
	Gui.prototype._configureGradientShader = function (gui, points) {
		// Create a folder for the gradient shader.
		var folder = gui.addFolder('Gradient configuration');
		// Get the available colors.
		var colors = points.colors;
		// Add the colours with callback functions.
		folder.addColor(colors, 'low').name('Low').onChange(this._onLowColor.bind(this, points));
		folder.addColor(colors, 'medium').name('Medium').onChange(this._onMediumColor.bind(this, points));
		folder.addColor(colors, 'high').name('High').onChange(this._onHighColor.bind(this, points));
		// Open the folder.
		folder.open();
	};

	return Gui;

});
