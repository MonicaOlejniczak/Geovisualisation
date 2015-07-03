uniform float uMin;
uniform float uMax;

uniform vec3 uLowColor;
uniform vec3 uMediumColor;
uniform vec3 uHighColor;

varying vec3 vPosition;

void main() {
	float bound = abs(uMax - uMin);
	float colorStop = bound * 0.3;
	float y = vPosition.y;
	vec3 color = mix(mix(uLowColor, uMediumColor, smoothstep(uMin, colorStop, y)), uHighColor, smoothstep(colorStop, uMax, y));
	gl_FragColor = vec4(color, 1.0);
}
