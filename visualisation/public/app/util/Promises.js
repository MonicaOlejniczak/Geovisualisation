/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	function Promises () {}

	Promises.requirePromise = function (path) {
		return new Promise(function (resolve) {
			require([path], function (module) {
				resolve(module);
			});
		});
	};

	return Promises;

});
