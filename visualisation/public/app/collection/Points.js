define(function (require) {

	'use strict';

	var Collection = require('collection/Collection');
	var Point = require('model/Point');

	return Collection.extend({

		model: Point

	});

});