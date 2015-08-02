/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Shader = require('helper/Shader');

	/**
	 * Initialises the skybox.
	 *
	 * @constructor
	 */
	function Skybox () {
		this._baseDirectory = 'assets/images/skybox/';

		var map = THREE.ImageUtils.loadTextureCube([
			this._baseDirectory + '1.jpg',
			this._baseDirectory + '1.jpg',
			this._baseDirectory + '1.jpg',
			this._baseDirectory + '1.jpg',
			this._baseDirectory + '1.jpg',
			this._baseDirectory + '1.jpg'
		]);

		var size = 2500;
		var geometry = new THREE.BoxGeometry(size, size, size);
		var material = new THREE.MeshBasicMaterial({
			envMap: map,
			side: THREE.BackSide
		});
		this.mesh = new THREE.Mesh(geometry, material);
	}

	Skybox.prototype.constructor = Skybox;

	return Skybox;

});
