define(function (require) {

	'use strict';

	var THREE = require('threejs');
	var Model = require('model/Model');

	return Model.extend({

		defaults: {
			coordinate: new THREE.Vector2(),
			magnitude: 0
		},

		position: function () {
			var coordinate = this.get('coordinate');
			return new THREE.Vector3(coordinate.x, this.get('magnitude'), coordinate.y);
		}

	});

});