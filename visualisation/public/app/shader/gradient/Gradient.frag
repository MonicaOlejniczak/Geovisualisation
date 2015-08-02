uniform vec2 uBound;

uniform vec3 uLowColor;
uniform vec3 uMediumColor;
uniform vec3 uHighColor;

varying vec3 vPosition;

void main() {
	// Get the min and max from the bound.
	float min = uBound.x;
	float max = uBound.y;
	// Calculate the bound and colour stop.
	float bound = abs(max - min);
	float colorStop = bound * 0.3;
	// Get the current y position of the vertex.
	float y = vPosition.y;
	// Calculate the colour.
	vec3 color = mix(mix(uLowColor, uMediumColor, smoothstep(min, colorStop, y)), uHighColor, smoothstep(colorStop, max, y));
	gl_FragColor = vec4(color, 1.0);
}
