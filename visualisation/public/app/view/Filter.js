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

		min = Math.floor(min);
		max = Math.ceil(max);

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

		// Create a container for the inputs.
		var $inputs = $(document.createElement('div')).addClass('inputs');

		// Create the min and max inputs.
		var $min = this.createInput('Min', min, min, max).addClass('min');
		var $max = this.createInput('Max', max, min, max).addClass('max');

		// Append the min and max inputs to the inputs element and return it.
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

		// Create an group for the label and its input.
		var $group = $(document.createElement('div')).addClass('group');

		// Create an id for the label.
		var id = 'input-' + label.toLowerCase();

		// Create the input element.
		var $input = $(document.createElement('input')).attr({
			id: id,
			type: 'number',
			value: value.toFixed(2),
			min: min,
			max: max,
			step: 1
		});

		// Create the label for the input element.
		var $label = $(document.createElement('label')).attr('for', id).html(label);

		// Append the label and its input to the group.
		$group.append($label, $input);
		return $group;

	};

	/**
	 * Adds event listeners to the slider and inputs for when their values are changed.
	 *
	 * @param $slider The jQuery slider element.
	 * @param $inputs The jQuery inputs element.
	 * @param property The property used for filtering.
	 */
	Filter.prototype.addEventListeners = function ($slider, $inputs, property) {

		// Find the min and max input elements.
		var $min = $inputs.find('.min input');
		var $max = $inputs.find('.max input');

		// Retrieve the noUiSlider object from the slider element.
		var slider = $slider.get(0).noUiSlider;

		// Listen to the keyup events on the min and max inputs.
		$min.keyup({slider: slider, callback: this.onMin}, this.onKeyUp.bind(this));
		$max.keyup({slider: slider, callback: this.onMax}, this.onKeyUp.bind(this));

		// Add an update event listener to the slider element.
		slider.on('update', this.onUpdate.bind(this, $min, $max, property));

	};

	/**
	 * An event triggered when a key is released on a filter input.
	 *
	 * This method checks that the left and right arrow keys have not been pressed so the user can navigate inside the
	 * input with these keys. If these keys have not been pressed, the callback that is attached to the event object is
	 * delayed. This ensures the user can keep typing for the delayed amount, without the callback executing.
	 *
	 * @param event The jQuery keyup event.
	 */
	Filter.prototype.onKeyUp = function (event) {
		var key = event.keyCode;
		// Only initiate the key up event if the left and right arrow keys have not been pressed. This enables the user
		// to move around the input.
		if (key !== 37 && key !== 39) {
			// Get the callback function and delay in milliseconds.
			var data = event.data;
			var callback = data.callback || function () {};
			var delay = data.delay || 100;

			// Clear the timer if it exists and initiate a new timeout with the specified callback, delaying the true
			// keyup event.
			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(callback.bind(this, event), delay);
		}
	};

	/**
	 * An event handler called when filtering.
	 *
	 * This method first retrieves the min and max values from the array and checks the index of which handle on the
	 * slider was pressed by the user. When this index is 0, it means that the min value on the slider was changed,
	 * otherwise the max handle was changed. The collection is then filtered using a function that checks the the model
	 * property being filtered is within the bounds of the min and max values.
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
	 * An event handler called when the min input value has changed on a keyup event.
	 *
	 * @param event The jQuery keyup event.
	 */
	Filter.prototype.onMin = function (event) {
		var slider = event.data.slider;
		if (slider) {
			var input = event.target;
			var value = input.value;
			if (value !== "") {
				slider.set([value, null]);
			}
		}
	};

	/**
	 * An event handler called when the max input value has changed on a keyup event.
	 *
	 * @param event The jQuery keyup event.
	 */
	Filter.prototype.onMax = function (event) {
		var slider = event.data.slider;
		if (slider) {
			var input = event.target;
			var value = input.value;
			if (value !== "") {
				slider.set([null, value]);
			}
		}
	};

	return Filter;

});
