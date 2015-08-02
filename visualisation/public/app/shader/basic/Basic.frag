#include "util/Convert.h"

uniform float uMagnitude;

uniform vec2 uBound;
uniform vec2 uColorRange;

uniform float uSaturation;
uniform float uLightness;

void main() {
	float value = clamp(convertRange(uBound, uColorRange, uMagnitude), 0.0, 1.0);
	vec3 color = hsv2rgb(vec3(value, uSaturation, uLightness));
	gl_FragColor = vec4(color, 1.0);
}
