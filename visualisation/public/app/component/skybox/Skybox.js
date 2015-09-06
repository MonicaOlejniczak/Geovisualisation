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
	 * @param camera The main camera.
	 * @constructor
	 */
	function Skybox (camera) {
		THREE.Mesh.call(this);

		this._baseDirectory = 'assets/images/skybox/space/';
		this._fileExtension = '.png';

		var urls = [
			this._baseDirectory + 'right' + this._fileExtension, // pos x
			this._baseDirectory + 'left' + this._fileExtension, // neg x
			this._baseDirectory + 'top' + this._fileExtension, // pos y
			this._baseDirectory + 'bottom' + this._fileExtension, // neg y
			this._baseDirectory + 'back' + this._fileExtension, // pos z
			this._baseDirectory + 'front' + this._fileExtension // neg z
		];

		var materials = [];
		for (var i = 0, len = urls.length; i < len; i++) {
			var texture = THREE.ImageUtils.loadTexture(urls[i]);
			materials.push(new THREE.MeshBasicMaterial({
				side: THREE.BackSide,
				color: new THREE.Color(),
				map: texture
			}));
		}

		var size = this.size = 5000;
		this.geometry = new THREE.BoxGeometry(1, 1, 1);
		this.material = new THREE.MeshFaceMaterial(materials);

		this.scale.set(size, size, size);
		this.rotateX(Math.PI * 0.5);
		this.position.copy(camera.position);
	}

	Skybox.prototype = Object.create(THREE.Mesh.prototype);
	Skybox.prototype.constructor = Skybox;

	/**
	 * Updates the position of the skybox.
	 *
	 * @param position The new position of the skybox.
	 */
	Skybox.prototype.updatePosition = function (position) {
		this.position.copy(position);
	};

	return Skybox;

});
