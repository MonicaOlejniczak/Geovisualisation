uniform float uMin;
uniform float uMax;
uniform float uMagnitude;

uniform vec3 uLowColor;
uniform vec3 uMediumColor;
uniform vec3 uHighColor;

uniform vec3 uBasePosition;

varying vec3 vPosition;

void main() {
	float midPoint = abs(uMax - uMin) * 0.5;
	float y = vPosition.y;
	vec3 color = mix(uLowColor, uMediumColor, smoothstep(uMin, midPoint, y));
	color = mix(color, uHighColor, smoothstep(midPoint, uMax, y));
	gl_FragColor = vec4(color, 1.0);
}
