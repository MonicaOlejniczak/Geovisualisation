#include "util/Convert.h"

uniform float uMagnitude;

uniform float uMin;
uniform float uMax;

uniform float uMinRange;
uniform float uMaxRange;

uniform float uSaturation;
uniform float uLightness;

void main() {
	vec3 color = hsv2rgb(vec3(convertRange(vec2(uMin, uMax), vec2(uMinRange, uMaxRange), uMagnitude), uSaturation, uLightness));
	gl_FragColor = vec4(color, 1.0);
}
