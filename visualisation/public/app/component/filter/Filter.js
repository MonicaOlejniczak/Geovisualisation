/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var $ = require('jquery');
	var Checkbox = require('component/filter/checkbox/Checkbox');
	var Slider = require('component/filter/slider/Slider');

	/**
	 * Initialises the filter.
	 *
	 * @param collection The points collection.
	 * @param keys The keys used for the x, y and z axis.
	 * @param [filters] The existing filters that permanently hide information.
	 * @constructor
	 */
	function Filter (collection, keys, filters) {
		this.collection = collection;
		this.filters = filters || [];
		this.map = {};
		this.configureFilters($('#filters .filters'), keys);
	}

	/**
	 * Configures the filter elements.
	 *
	 * @param $filters The jQuery element to append filters.
	 * @param keys The keys used for the x, y and z axis.
	 */
	Filter.prototype.configureFilters = function ($filters, keys) {
		//$filters.append(this.createSliderGroup(keys.x));
		//$filters.append(this.createSliderGroup(keys.y));
		$filters.append(this.createSlider(keys.z));
		var model = this.collection.first();
		// Retrieve the properties associated with a checkbox by filtering out default model properties which represent redundant values.
		var properties = model.keys().filter(function (property) {
			return this.filters.indexOf(property) === -1;
		}.bind(this));
		$filters.append(this.createCheckboxes(properties));
	};

	/**
	 * Creates a filter that contains a heading, slider and input.
	 *
	 * @param property The property being filtered.
	 * @returns {*|jQuery}
	 */
	Filter.prototype.createSlider = function (property) {

		var heading = property;

		// Retrieve the min and max from the collection.
		var min = this.collection.min(function (model) {return model.get(property)}).get(property);
		var max = this.collection.max(function (model) {return model.get(property)}).get(property);

		min = Math.floor(min);
		max = Math.ceil(max);

		var view = new Slider({
			model: new Backbone.Model({
				heading: heading,
				min: min,
				max: max
			})
		});

		var $slider = view.$el.find('.slider');
		var slider = $slider.get(0);
		noUiSlider.create(slider, {
			start: [min, max],
			connect: true,
			range: {
				min: min,
				max: max
			}
		});

		// Find the min and max input elements.
		var $min = view.$el.find('.min input');
		var $max = view.$el.find('.max input');

		// Retrieve the noUiSlider object from the slider element.
		var sliderObj = slider.noUiSlider;

		// Listen to the keyup events on the min and max inputs.
		$min.keyup({slider: sliderObj, callback: this.onMin}, this.onKeyUp.bind(this));
		$max.keyup({slider: sliderObj, callback: this.onMax}, this.onKeyUp.bind(this));

		// Add an update event listener to the slider element.
		sliderObj.on('update', this.onUpdate.bind(this, $min, $max, property));

		return view.$el;

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
			return !(value > min && value <= max);
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

	/**
	 * Creates a checkbox for each property.
	 *
	 * @param properties The list of properties in the model.
	 * @returns {*|jQuery|HTMLElement}
	 */
	Filter.prototype.createCheckboxes = function (properties) {
		var $checkboxes = $(document.createElement('div'));
		for (var i = 0, len = properties.length; i < len; i++) {
			$checkboxes.append(this.createCheckbox(properties[i]));
		}
		return $checkboxes;
	};

	/**
	 * Creates a checkbox filter.
	 *
	 * @param property The property associated with the checkbox.
	 * @returns {*|jQuery}
	 */
	Filter.prototype.createCheckbox = function (property) {
		var id = 'checkbox-' + property;
		var label = (property.charAt(0).toUpperCase() + property.substring(1).toLowerCase()).replace(/_/g, ' ');

		var view = new Checkbox({
			model: new Backbone.Model({
				id: id,
				label: label
			})
		});

		view.$el.find('input[type="checkbox"]').on('change', this.onToggle.bind(this));
		this.map[id] = property;

		return view.$el;
	};

	/**
	 * An event triggered when a checkbox is toggled.
	 *
	 * @param event The jQuery click event.
	 */
	Filter.prototype.onToggle = function (event) {
		var checkbox = event.currentTarget;
		var checked = checkbox.checked;
		var property = this.map[checkbox.id];
		if (checked) {
			var index = this.filters.indexOf(property);
			if (index > -1) {
				this.filters.splice(index, 1);
			}
		} else {
			this.filters.push(property);
		}
	};

	return Filter;

});
