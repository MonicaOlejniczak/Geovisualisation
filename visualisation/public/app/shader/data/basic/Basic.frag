#include "data/Data.h"

uniform vec2 uBound;
uniform vec2 uColorRange;

uniform float uMagnitude;

uniform float uSaturation;
uniform float uValue;

void main() {
	vec3 color = getBasicColor(uBound, uColorRange, uMagnitude, uSaturation, uValue);
	gl_FragColor = vec4(color, 1.0);
}
