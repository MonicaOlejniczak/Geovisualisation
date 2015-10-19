define(function (require) {

	'use strict';

	function Filter (collection) {
		this.filtered = [];
		collection.on('filter', this.onFilter, this);
	}

	Filter.prototype.onFilter = function (filteredCollection) {
		this.clear();

		filteredCollection.each(function (model) {
			model.trigger('applyFilter', true);
			this.filtered.push(model);
		}, this);
	};

	Filter.prototype.clear = function () {
		var filtered = this.filtered;
		for (var i = 0, len = filtered.length; i < len; i++) {
			var model = filtered[i];
			model.trigger('applyFilter', false);
		}
		this.filtered = [];
	};

	return Filter;

});