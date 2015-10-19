define(function (require) {

	'use strict';

	var Backbone = require('backbone');
	var Handlebars = require('handlebars');

	var template = require('text!component/filters/slider/Slider.hbs');

	return Backbone.View.extend({
		template: template,

		initialize: function () {
			this.render();
		},

		render: function () {
			var template = Handlebars.compile(this.template);
			this.$el.html(template(this.model.toJSON()));
			return this;
		}

	});

});