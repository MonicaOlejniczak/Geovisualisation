/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Visualisation = require('view/Visualisation');
	var LightHelper = require('helper/Light');
	var Shader = require('util/Shader');

	var Color = require('util/Color');

	/**
	 * Initialises the visualisation.
	 *
	 * @param canvas The HTML canvas.
	 * @constructor
	 */
	function HeatMap (canvas) {
		Visualisation.call(this, canvas.get(0), {
			camera: {position: new THREE.Vector3(0, 100, 200)},
			mouseControls: true
		});
		// Initialise the default values and setup the scene.
		this._init();
		this._setupScene(this.getScene());
		// Load the data from the test file and render the scene.
		this.load('app/data/generate.js', this.processData);
		this.render();
	}

	HeatMap.prototype = Object.create(Visualisation.prototype);
	HeatMap.prototype.constructor = HeatMap;

	/**
	 * Initialises the default values for the visualisation.
	 *
	 * @private
	 */
	HeatMap.prototype._init = function () {
		// Set the width and height of the geometry.
		this.width = this.height = 0.5;
		// Set the colors to be used with the points.
		this.colors = {
			low: new THREE.Color(0xffe900),
			medium: new THREE.Color(0xff8c00),
			high: new THREE.Color(0xb51212)
		};
		// Set the texture details.
		this.ground = {
			source: 'assets/images/earth.jpg',
			height: 10,
			size: 250,
			color: new THREE.Color(0x222222)
		};
		// Set the shader path.
		this._shaderPath = 'gradient/Gradient';
		// Initialise the min and max of the data.
		this.min = this.max = 0;
	};

	/**
	 * Sets up the scene by adding the lights and ground.
	 *
	 * @param scene The THREE.js scene.
	 * @private
	 */
	HeatMap.prototype._setupScene = function (scene) {
		// Make the camera look at the scene.
		this.getCamera().lookAt(scene.position);
		// Create the lights and ground, then add them to the scene.
		var lights = this._createLights();
		var ground = this._createGround(this.ground);
		scene.add(lights, ground);
	};

	/**
	 * Creates and adds lights to the scene.
	 *
	 * @private
	 */
	HeatMap.prototype._createLights = function () {
		return LightHelper.createPointLight({
			position: new THREE.Vector3(0, 10, 0)
		});
	};

	/**
	 * Creates the ground for the scene.
	 *
	 * @param ground The object that contains details about the ground.
	 * @private
	 */
	HeatMap.prototype._createGround = function (ground) {
		// Create a mesh that can be passed into the map.
		var mesh = new THREE.Mesh();
		// Create the texture and use it for the mesh material.
		var texture = this._createTexture(mesh, ground);
		// Create the shader and add the material to the mesh.
		new Shader('earth/Earth', {
			uniforms: {
				uTexture: {type: 't', value: texture},
				uColor: {type: 'c', value: ground.color},
				uSurfacePosition: {type: 'f', value: ground.height * 0.5},
				uHue: {type: 'f', value: 1.0},
				uSaturation: {type: 'f', value: 1.0},
				uValue: {type: 'f', value: 1.0},
				uRedShift: {type: 'f', value: 0.0},
				uGreenShift: {type: 'f', value: 0.0},
				uBlueShift: {type: 'f', value: 50.0}
			}
		}).then(function (material) {
			mesh.material = material;
		}.bind(this));
		// Return the ground mesh.
		return mesh;
	};

	/**
	 * Creates a texture to be used with the ground.
	 *
	 * @param mesh The ground mesh.
	 * @param ground The object that contains details about the ground.
	 * @returns {*}
	 * @private
	 */
	HeatMap.prototype._createTexture = function (mesh, ground) {
		// Load the texture using the source file stored in the ground instance variable.
		var map = THREE.ImageUtils.loadTexture(ground.source, THREE.UVMapping, this._onTextureLoad.bind(this, mesh, ground));
		// Set the min and mag filter to linear for textures that are not a power of 2.
		map.minFilter = THREE.LinearFilter;
		map.magFilter = THREE.LinearFilter;
		// Return the texture.
		return map;
	};

	/**
	 * This function is triggered when the texture for the ground has loaded. It obtains the aspect ratio of the image
	 * through the loaded texture and replaces the mesh used with the ground so that it is proportional to the image.
	 * The position of the mesh is then adjusted so the base of the geometry is on the ground.
	 *
	 * @param mesh The ground mesh.
	 * @param ground The object that contains details about the ground.
	 * @param texture The texture that was loaded.
	 * @private
	 */
	HeatMap.prototype._onTextureLoad = function (mesh, ground, texture) {
		var image = texture.image;
		var aspectRatio = image.width / image.height;
		var size = ground.size;
		mesh.geometry = new THREE.BoxGeometry(size * aspectRatio, ground.height, size);
		mesh.position.setY(ground.height * 0.5);
	};

	/**
	 * Processes the data that contains the point information.
	 *
	 * @param data The data being processed.
	 */
	HeatMap.prototype.processData = function (data) {
		var points = [];
		var geometry = [];
		// Iterates through the data.
		for (var i = 0, len = data.length; i < len; i++) {
			// Obtain the current point and preprocess it.
			var point = data[i];
			points.push(point);
			geometry.push(this._preprocessPoint(point));
		}
		this._processPoints(points, geometry);
	};

	/**
	 * Preprocesses the point data by obtaining the min and max bounds of the data.
	 *
	 * @param point The point being pre-processed.
	 * @returns {THREE.BoxGeometry}
	 * @private
	 */
	HeatMap.prototype._preprocessPoint = function (point) {
		// Create the geometry and compute its bounding box.
		var geometry = this._createGeometry(point[2]);
		geometry.computeBoundingBox();
		// Obtain the bounding box of the geometry and set the min and max values.
		var boundingBox = geometry.boundingBox;
		this.max = Math.max(this.max, boundingBox.max.y);
		return geometry;
	};

	/**
	 * Creates and returns the geometry using its transformed coordinates.
	 *
	 * @param magnitude The magnitude of the geometry.
	 * @returns {THREE.BoxGeometry}
	 * @private
	 */
	HeatMap.prototype._createGeometry = function (magnitude) {
		var transform = this.transform(this.width, this.height, magnitude);
		return new THREE.BoxGeometry(transform.x, transform.y, transform.z);
	};

	/**
	 * Processes the preprocessed points data by creating the point meshes and adding them to the scene.
	 *
	 * @param points The points being processed.
	 * @param geometry The geometry associated with the points.
	 * @private
	 */
	HeatMap.prototype._processPoints = function (points, geometry) {
		// Retrieve the scene and set the target to its position.
		var scene = this.getScene();
		var target = scene.position;
		// Retrieve the ground level.
		var groundLevel = this.ground.height;
		// Get the colors being used with the point and create a mesh to add the points to.
		var colors = this.colors;
		var parent = new THREE.Mesh();
		// Load the shader before iterating through each point.
		new Shader(this._shaderPath).then(function (material) {
			// Iterate through each point and associated geometry.
			for (var i = 0, len = points.length; i < len; i++) {
				var mesh = new THREE.Mesh(geometry[i], material);
				// Process the current point in the data.
				parent.add(this._processPoint(points[i], mesh, target, colors, groundLevel));
			}
		}.bind(this));
		// Add every point to the scene.
		scene.add(parent);
	};

	/**
	 * Processes a point by creating a mesh and applying transforms to set its position.
	 *
	 * @param point The original data point.
	 * @param mesh The mesh that was created from pre-processing.
	 * @param target The target position for the point to look at.
	 * @param colors The colors being used with the point.
	 * @param groundLevel The value that constitutes the ground level where the point can be drawn.
	 * @returns {THREE.Mesh}
	 * @private
	 */
	HeatMap.prototype._processPoint = function (point, mesh, target, colors, groundLevel) {
		// Obtain the magnitude from the point.
		var magnitude =  Math.abs(point[2]);
		// Update the uniforms of the material.
		mesh.material.uniforms = {
			uMin: {type: 'f', value: this.min},
			uMax: {type: 'f', value: this.max},
			// Basic shader uniforms.
			uMagnitude: {type: 'f', value: magnitude},
			uMinRange: {type: 'f', value: 0.15},
			uMaxRange: {type: 'f', value: 0.5},
			uSaturation: {type: 'f', value: 1.0},
			uLightness: {type: 'f', value: 1.0},
			// Gradient shader uniforms.
			uLowColor: {type: 'c', value: colors.low},
			uMediumColor: {type: 'c', value: colors.medium},
			uHighColor: {type: 'c', value: colors.high}
		};
		// Transform the position into the correct coordinates.
		var position = this.transform(point[0], point[1], magnitude);
		// Rotate the mesh so it is looking at the target vector.
		mesh.lookAt(target);
		// Set the position of the mesh and adjust its y-position so that it is above the ground.
		mesh.position.set(position.x, position.y, position.z);
		mesh.position.setY(Math.abs(mesh.position.y) * 0.5 + groundLevel);
		// Return the mesh that was created.
		return mesh;
	};

	return HeatMap;

});
