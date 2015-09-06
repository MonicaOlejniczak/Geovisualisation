/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');

	/**
	 * Initialises the filter.
	 *
	 * @param collection The points collection.
	 * @constructor
	 */
	function Filter (collection) {
		this.collection = collection;
		this.configureFilters($('#filters .filters'));
	}

	/**
	 * Configures the filter elements.
	 */
	Filter.prototype.configureFilters = function ($filters) {
		this.createFilter($filters, 'magnitude');
	};

	/**
	 * Creates a filter that contains a heading, slider and input.
	 *
	 * @param $filters The jQuery element to append the filter to.
	 * @param property THe property being filtered.
	 */
	Filter.prototype.createFilter = function ($filters, property) {

		// Create a container div for the filter.
		var $filter = $(document.createElement('div')).addClass('filter');

		// Retrieve the min and max from the collection.
		var min = this.collection.min(function (model) {return model.get(property)}).get(property);
		var max = this.collection.max(function (model) {return model.get(property)}).get(property);

		// Create the filter heading, slider and inputs.
		var $heading = this.createHeading(property);
		var $slider = this.createSlider(property, min, max);
		var $inputs = this.createInputs(min, max);

		this.addEventListeners($slider, $inputs, property);

		// Append each filter item.
		$filter.append($heading, $slider, $inputs);

		// Append the filter to the filters.
		$filters.append($filter);

	};

	/**
	 * Creates the heading for the filter.
	 *
	 * @param property The property being filtered, which becomes the heading html.
	 * @returns {*|jQuery}
	 */
	Filter.prototype.createHeading = function (property) {
		return $(document.createElement('h2')).html(
			property.charAt(0).toUpperCase() + property.substring(1).toLowerCase()
		);
	};

	/**
	 * Creates the slider for the filter.
	 *
	 * @param property The property being filtered.
	 * @param min The min value of the property from the collection.
	 * @param max The max value of the property from the collection.
	 * @returns {*|jQuery}
	 */
	Filter.prototype.createSlider = function (property, min, max) {
		// Create the slider element.
		var $element = $(document.createElement('div')).addClass('slider');

		// Create the noUiSlider with the specified range.
		var slider = noUiSlider.create($element.get(0), {
			start: [min, max],
			connect: true,
			range: {
				min: min,
				max: max
			}
		});

		// Append the slider and element to the filter.
		$element.append(slider);
		return $element;

	};

	/**
	 * Creates user inputs for the filter.
	 *
	 * @param min The min value of the property from the collection.
	 * @param max The max value of the property from the collection.
	 * @returns {*|jQuery}
	 */
	Filter.prototype.createInputs = function (min, max) {

		var $inputs = $(document.createElement('div')).addClass('inputs');

		var $min = this.createInput('Min', min, min, max).addClass('min');
		var $max = this.createInput('Max', max, min, max).addClass('max');

		$inputs.append($min, $max);
		return $inputs;

	};

	/**
	 * Creates an input with a label.
	 *
	 * @param label The label for the input.
	 * @param value The value of the input.
	 * @param min The min value of the input.
	 * @param max The max value of the input.
	 * @returns {*|jQuery}
	 */
	Filter.prototype.createInput = function (label, value, min, max) {
		var $group = $(document.createElement('div')).addClass('group');

		var id = 'input-' + label.toLowerCase();
		var $input = $(document.createElement('input')).attr({
			id: id,
			type: 'number',
			value: value.toFixed(2),
			min: min,
			max: max,
			step: 1
		});

		var $label = $(document.createElement('label')).attr('for', id).html(label);

		$group.append($label, $input);
		return $group;
	};

	Filter.prototype.addEventListeners = function ($slider, $inputs, property) {

		var $min = $inputs.find('.min input');
		var $max = $inputs.find('.max input');

		// Retrieve the noUiSlider object from the slider element.
		var slider = $slider.get(0).noUiSlider;

		// Listen to the change events on the sliders.
		$min.change(slider, this.onMin.bind(this));
		$max.change(slider, this.onMax.bind(this));

		// Add an update event listener to the slider element.
		slider.on('update', this.onUpdate.bind(this, $min, $max, property));

	};

	/**
	 * An event handler called when filtering.
	 *
	 * @param $min The min HTML input.
	 * @param $max The max HTML input.
	 * @param property The property being filtered.
	 * @param values The input values on the slider.
	 * @param handle The index of the selected handler.
	 */
	Filter.prototype.onUpdate = function ($min, $max, property, values, handle) {
		var min = parseInt(values[0], 10);
		var max = parseInt(values[1], 10);

		// Check if the max value was changed.
		if (handle) {
			// Update the value of the max input and adjust the max attribute for the min input.
			$max.val(max);
			$min.attr('max', max);

		} else {
			// Update the value of the min input and adjust the min attribute for the max input.
			$min.val(min);
			$max.attr('min', min);
		}

		// Filter the collection using the specified callback function.
		this.collection.filterBy(function (model) {
			// Get the value from the model using the filter property, then filter.
			var value = model.get(property);
			return !(value > min && value < max);
		});
	};

	/**
	 * An event handler called when the min input value is changed.
	 *
	 * @param event The jQuery change event.
	 */
	Filter.prototype.onMin = function (event) {
		var slider = event.data;
		var input = event.target;
		slider.set([input.value, null]);
	};

	/**
	 * An event handler called when the max input value is changed.
	 *
	 * @param event The jQuery change event.
	 */
	Filter.prototype.onMax = function (event) {
		var slider = event.data;
		var input = event.target;
		slider.set([null, input.value]);
	};

	return Filter;

});
