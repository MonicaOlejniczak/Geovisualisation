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
		var gui = new dat.GUI({autoPlace: false});

		$('#configuration').append(gui.domElement);
		this.configure(gui, visualisation);
	}

	/**
	 * Configures the GUI given the instance of the controls and the visualisation.
	 *
	 * @param gui The GUI controls.
	 * @param visualisation The visualisation associated with the GUI controls.
	 */
	Gui.prototype.configure = function (gui, visualisation) {
		this.configurePoints(gui, visualisation.points);
		this.configureSurface(gui, visualisation);
	};

	/**
	 * Configures the surface.
	 *
	 * @param gui The GUI controls.
	 * @param visualisation The visualisation associated with the GUI controls.
	 */
	Gui.prototype.configureSurface = function (gui, visualisation) {
		var surface = visualisation.surface;
		// Create a folder for the surface colour.
		var folder = gui.addFolder('Surface');
		$(surface).on({
			ready: function (event) {
				var material = surface.material;
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
				folder.addColor(uniforms.uColor, 'value').name('Atmosphere').onChange(this.onAtmosphere.bind(this, atmosphere));
			}.bind(this)
		});
	};

	/**
	 * An event that triggers when the user selects a new atmosphere colour.
	 *
	 * @param atmosphere The atmosphere object.
	 * @param color The new colour of the atmosphere.
	 */
	Gui.prototype.onAtmosphere = function (atmosphere, color) {
		var material = atmosphere.material;
		material.uniforms['uColor'].value = this._convertColor(color);
	};

	/**
	 * Configures the points.
	 *
	 * @param gui The GUI controls.
	 * @param points The points associated with the visualisation.
	 */
	Gui.prototype.configurePoints = function (gui, points) {
		var folder = gui.addFolder('Data points');
		var mode = folder.add(points, 'mode', points.Mode).name('Mode');

		folder.add(points, 'alpha').min(0).max(1).name('Alpha').onChange(this.onAlpha.bind(this, points));

		var basicShader = this.configureBasicShader(folder, points);
		var gradientShader = this.configureGradientShader(folder, points);

		$(basicShader.domElement).find('.title').hide();
		$(gradientShader.domElement).find('.title').hide();

		this.configureMode(points, basicShader, gradientShader, points.mode);

		mode.onChange(this.onMode.bind(this, points, basicShader, gradientShader));
	};

	/**
	 * Configures the alpha for the points.
	 *
	 * @param points The points associated with the visualisation.
	 * @param value The value of alpha.
	 */
	Gui.prototype.onAlpha = function (points, value) {
		this.configurePointUniforms(points, 'uAlpha', value);
	};

	/**
	 * Configures the mode.
	 *
	 * @param points The points associated with the visualisation.
	 * @param basicShader The basic shader folderv.
	 * @param gradientShader The gradient shader folder.
	 * @param value The value of mode.
	 */
	Gui.prototype.onMode = function (points, basicShader, gradientShader, value) {
		this.configureMode(points, basicShader, gradientShader, value);
		this.configurePointUniforms(points, 'uMode', value);
	};

	/**
	 * Configures the display of the basic and gradient shader folders based on the value of the mode.
	 *
	 * @param points The points associated with the visualisation.
	 * @param basicShader The basic shader folder.
	 * @param gradientShader The gradient shader folder.
	 * @param value The value of mode.
	 */
	Gui.prototype.configureMode = function (points, basicShader, gradientShader, value) {
		value = parseInt(value, 10);
		// Checks if the value of the mode is basic.
		if (value === points.Mode.BASIC) {
			// Open the basic shader folder and close the gradient shader.
			basicShader.open();
			gradientShader.close();
		} else {
			// Close the basic shader folder and open the gradient shader.
			basicShader.close();
			gradientShader.open();
		}
	};

	/**
	 * Configures the basic shader controls.
	 *
	 * @param gui The GUI controls.
	 * @param points The points associated with the visualisation.
	 * @returns {*|dat.gui.GUI}
	 */
	Gui.prototype.configureBasicShader = function (gui, points) {
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
		return folder;
	};

	/**
	 * Converts a colour object of the form {r, g, b} to a THREE.js colour.
	 *
	 * @param color The colour being converted.
	 * @returns {THREE.Color} The converted colour.
	 */
	Gui.prototype.convertColor = function (color) {
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
	 * @param points The list of points.
	 * @param key The key for the material uniform.
	 * @param value The new value of the material uniform.
	 */
	Gui.prototype.configurePointUniforms = function (points, key, value) {
		points = points.getPoints();
		// Iterate through each point and update their shader material uniform.
		for (var i = 0, len = points.length; i < len; i++) {
			var point = points[i];
			var material = point.material;
			material.uniforms[key].value = value;
		}
	};

	/**
	 * An event triggered when the low colour controls have changed.
	 *
	 * @param points The points associated with the colour change.
	 * @param color The new colour of the objects.
	 */
	Gui.prototype.onLowColor = function (points, color) {
		color = this.convertColor(color);
		this.configurePointUniforms(points, 'uLowColor', color);
	};

	/**
	 * An event triggered when the medium colour controls have changed.
	 *
	 * @param points The points associated with the colour change.
	 * @param color The new colour of the objects.
	 */
	Gui.prototype.onMediumColor = function (points, color) {
		color = this.convertColor(color);
		this.configurePointUniforms(points, 'uMediumColor', color);
	};

	/**
	 * An event triggered when the high colour controls have changed.
	 *
	 * @param points The points associated with the colour change.
	 * @param color The new colour of the objects.
	 */
	Gui.prototype.onHighColor = function (points, color) {
		color = this.convertColor(color);
		this.configurePointUniforms(points, 'uHighColor', color);
	};

	/**
	 * Configures the gradient shader controls.
	 *
	 * @param gui The GUI controls.
	 * @param points The points associated with the visualisation.
	 * @returns {*|dat.gui.GUI}
	 */
	Gui.prototype.configureGradientShader = function (gui, points) {
		// Create a folder for the gradient shader.
		var folder = gui.addFolder('Gradient configuration');
		// Get the available colors.
		var colors = points.colors;
		// Add the colours with callback functions.
		folder.addColor(colors, 'low').name('Low').onChange(this.onLowColor.bind(this, points));
		folder.addColor(colors, 'medium').name('Medium').onChange(this.onMediumColor.bind(this, points));
		folder.addColor(colors, 'high').name('High').onChange(this.onHighColor.bind(this, points));
		return folder;
	};

	return Gui;

});
