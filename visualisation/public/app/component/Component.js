define(function (require) {

	'use strict';

	var THREE = require('threejs');

	function Component () {
		THREE.Mesh.call(this);
		this.addEventListeners();
	}

	Component.prototype = Object.create(THREE.Mesh.prototype);
	Component.prototype.constructor = Component;

	Component.prototype.addEventListeners = function () {
		if (this.model) {
			this.model.on('applyFilter', this.onApplyFilter, this);
		}
	};

	Component.prototype.onApplyFilter = function (applyFilter) {
		this.visible = !applyFilter;
	};

	return Component;

});