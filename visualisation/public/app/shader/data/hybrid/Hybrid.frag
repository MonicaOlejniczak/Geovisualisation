#include "data/Data.h"

uniform int uMode;
uniform vec2 uBound;
uniform float uAlpha;

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
		color = basicColor(uBound, uColorRange, uMagnitude, uSaturation, uLightness);
	} else {
		color = gradientColor(uBound, vPosition, uLowColor, uMediumColor, uHighColor);
	}
	gl_FragColor = vec4(color, uAlpha);
}
