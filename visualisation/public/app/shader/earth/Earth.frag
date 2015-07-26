#include "util/Convert.h"

uniform sampler2D uTexture;
uniform vec3 uColor;
uniform float uSurfacePosition;

uniform float uHue;
uniform float uSaturation;
uniform float uValue;

uniform float uRedShift;
uniform float uGreenShift;
uniform float uBlueShift;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
	if (vPosition.y < uSurfacePosition) {
		gl_FragColor = vec4(uColor, 1.0);
	} else {

	    vec3 originalColor = texture2D(uTexture, vUv).rgb;

	    vec2 originalColorRange = vec2(-100.0, 100.0);
	    vec2 rgbColorRange = vec2(0.0, 255.0);
	    vec2 finalColorRange = vec2(0.0, 1.0);

	    float redShift = convertRange(originalColorRange, rgbColorRange, uRedShift);
	    float greenShift = convertRange(originalColorRange, rgbColorRange, uGreenShift);
	    float blueShift = convertRange(originalColorRange, rgbColorRange, uBlueShift);

	    vec3 colorShift = vec3(redShift, greenShift, blueShift);
	    if (redShift == blueShift && blueShift == greenShift) {
	        colorShift = vec3(1.0, 1.0, 1.0) * rgbColorRange.y;
	    }

	    vec3 colorBalance = colorShift / rgbColorRange.y;
        vec3 color = rgb2hsv(colorBalance * originalColor);
    	// Preserve value
    	color = hsv2rgb(vec3(color.r * uHue, color.g * uSaturation * 0.9, rgb2value(originalColor) * 1.2));

		gl_FragColor = vec4(color, 1.0);
	}
}
