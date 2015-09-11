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

		this.baseDirectory = 'assets/images/skybox/space/';
		this.fileExtension = '.png';

		var urls = [
			this.baseDirectory + 'right' + this.fileExtension, // pos x
			this.baseDirectory + 'left' + this.fileExtension, // neg x
			this.baseDirectory + 'top' + this.fileExtension, // pos y
			this.baseDirectory + 'bottom' + this.fileExtension, // neg y
			this.baseDirectory + 'back' + this.fileExtension, // pos z
			this.baseDirectory + 'front' + this.fileExtension // neg z
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