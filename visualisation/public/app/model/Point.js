define(function (require) {

	'use strict';

	var Model = require('model/Model');

	return Model.extend({

		defaults: {
			x: 0,
			y: 0,
			z: 0,
			magnitude: 0
		}

	});

});