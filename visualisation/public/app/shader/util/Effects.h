#include "util/Convert.h"

const vec2 originalColorRange = vec2(-100.0, 100.0);
const vec2 rgbColorRange = vec2(0.0, 255.0);
const vec2 finalColorRange = vec2(0.0, 1.0);

vec3 hueSaturation(vec3 originalColor, float hue, float saturation, float value) {
    return hsv2rgb(rgb2hsv(originalColor) * vec3(hue, saturation, value));
}

/**
 * @see https://gist.github.com/liovch/3168961
 * @see https://en.wikipedia.org/wiki/Color_balance
 */
vec3 colorBalance(vec3 originalColor, vec3 colorShift) {

    colorShift = convertRange(originalColorRange, rgbColorRange, colorShift);
    if (colorShift.r == colorShift.g && colorShift.g == colorShift.b) {
        colorShift = vec3(1.0, 1.0, 1.0) * rgbColorRange.y;
    }

    float value = rgb2value(originalColor);

    const float a = 0.25;
    const float b = 0.333;
    const float scale = 0.7;

    float midtones = clamp((value - b) / a + 0.5, 0.0, 1.0) * clamp((value + b - 1.0) / -a + 0.5, 0.0, 1.0) * scale;
    vec3 colorBalance = clamp(colorShift / rgbColorRange.y, 0.0, 1.0);
	vec3 color = hsv2rgb(vec3(rgb2hsv((colorBalance * midtones) + originalColor).rg, value));

    return color;

}
