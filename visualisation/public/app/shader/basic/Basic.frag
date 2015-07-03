uniform float uMagnitude;

uniform float uMin;
uniform float uMax;

uniform float uMinRange;
uniform float uMaxRange;

uniform float uSaturation;
uniform float uLightness;

vec3 hsv2rgb(vec3 color) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(color.xxx + K.xyz) * 6.0 - K.www);
    return color.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), color.y);
}

float convertRange(float originalStart, float originalEnd, float newStart, float newEnd, float value) {
	float ratio = (newEnd - newStart) / (originalEnd - originalStart);
	float newValue = newStart + ((value - newStart) * ratio);
    return clamp(newValue, newStart, newEnd);
}

void main() {
	vec3 color = hsv2rgb(vec3(convertRange(uMin, uMax, uMinRange, uMaxRange, uMagnitude), uSaturation, uLightness));
	gl_FragColor = vec4(color, 1.0);
}
