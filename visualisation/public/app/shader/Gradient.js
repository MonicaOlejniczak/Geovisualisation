/**
 * @author Monica Olejniczak
 */
define(function (require) {

	'use strict';

	var vertex = [

		'varying vec3 vWorldPosition;',

		'void main() {',
			'vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;',
			'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
		'}'

	].join('\n');

	var fragment = [

		'uniform float uMin;',
		'uniform float uMax;',
		'uniform float uMagnitude;',

		'uniform vec3 uTopColor;',
		'uniform vec3 uMiddleColor;',
		'uniform vec3 uBottomColor;',

		'varying vec3 vWorldPosition;',

		'void main() {',
			'vec3 color = mix(uBottomColor, uTopColor, uMiddleColor);',
			// Distance from the ground up to the world position.
			'float distance = abs(distance(vec3(vWorldPosition.x, 0, vWorldPosition.z), vWorldPosition));',
			'float midPoint = abs(uMax - uMin) * 0.5;',
			'if (distance > midPoint) {',
				'gl_FragColor = vec4(uTopColor, 1.0);',
			'} else {',
				'gl_FragColor = vec4(uBottomColor, 1.0);',
			'}',
		'}'

	].join('\n');

	return {
		vertex: vertex,
		fragment: fragment
	}

});
