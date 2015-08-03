#include "data/Data.h"

uniform int uMode;
uniform vec2 uBound;

// Basic

uniform vec2 uColorRange;

uniform float uMagnitude;

uniform float uSaturation;
uniform float uLightness;

// Gradient

uniform vec3 uLowColor;
uniform vec3 uMediumColor;
uniform vec3 uHighColor;

varying vec3 vPosition;

void main() {
	vec3 color;
	if (uMode == 0) {
		color = getBasicColor(uBound, uColorRange, uMagnitude, uSaturation, uLightness);
	} else {
		color = getGradientColor(uBound, vPosition, uLowColor, uMediumColor, uHighColor);
	}
	gl_FragColor = vec4(color, 1.0);
}