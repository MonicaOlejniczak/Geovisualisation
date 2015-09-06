define(function (require) {

	'use strict';

	var Backbone = require('backbone');

	return Backbone.Collection.extend({

		//initialize: function (models, options) {
		//	this.filters = [];
		//	this.models = models;
		//},

		filterBy: function (fn) {
			var collection = new Backbone.Collection();
			this.each(function (model) {
				if (fn.call(this, model)) {
					collection.add(model);
				}
			}, this);
			this.trigger('filter', collection);
			return collection;
		}

	});

});