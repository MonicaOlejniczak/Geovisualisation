#include "util/Convert.h"

vec3 basicColor(vec2 uBound, vec2 uColorRange, float uMagnitude, float uSaturation, float uLightness) {
	float value = clamp(convertRange(uBound, uColorRange, uMagnitude), 0.0, 1.0);
	return hsv2rgb(vec3(value, uSaturation, uLightness));
}

vec3 gradientColor(vec2 uBound, vec3 vPosition, vec3 uLowColor, vec3 uMediumColor, vec3 uHighColor) {
	// Get the min and max from the bound.
	float min = uBound.x;
	float max = uBound.y;
	// Calculate the bound and colour stop.
	float bound = abs(max - min);
	float colorStop = bound * 0.3;
	// Get the current y position of the vertex.
	float y = vPosition.y;
	// Return the gradient colour.
    return mix(mix(uLowColor, uMediumColor, smoothstep(min, colorStop, y)), uHighColor, smoothstep(colorStop, max, y));
}
