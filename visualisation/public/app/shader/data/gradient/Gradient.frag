#include "data/Data.h"

uniform vec2 uBound;

uniform vec3 uLowColor;
uniform vec3 uMediumColor;
uniform vec3 uHighColor;

varying vec3 vPosition;

void main() {
	vec3 color = getGradientColor(uBound, vPosition, uLowColor, uMediumColor, uHighColor);
	gl_FragColor = vec4(color, 1.0);
}
