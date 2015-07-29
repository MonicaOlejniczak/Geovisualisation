#include "util/Effects.h"

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
	    vec3 colorShift = vec3(uRedShift, uGreenShift, uBlueShift);
	    vec3 color = colorBalance(originalColor, colorShift);

		gl_FragColor = vec4(color, 1.0);
	}
}
