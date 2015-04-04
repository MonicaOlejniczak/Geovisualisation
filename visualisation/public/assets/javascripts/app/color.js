/**
 * @author Monica Olejniczak
 */
define(['THREE'], function (THREE) {

    'use strict';

    /**
     * Initialises the color class.
     *
     * @constructor
     */
    var Color = function () {};

    Color.prototype.constructor = Color;

    /**
     * Generates a random colour, blended with a particular colour.
     *
     * @param blend The THREE.Color to blend with the randomly generated values.
     * @returns {THREE.Color}
     */
    Color.generate = function (blend) {
        var red = Math.random();
        var green = Math.random();
        var blue = Math.random();
        if (blend != null) {
            red = (red + blend.r) * 0.5;
            green = (green + blend.g) * 0.5;
            blue = (blue + blend.b) * 0.5;
        }
        return new THREE.Color(red, green, blue);
    };

    /**
     * Darkens or lightens a colour based on the luminance.
     *
     * @param color The colour being darkened or lightened.
     * @param luminance The intensity of the luminance.
     * @returns {THREE.Color}
     */
    Color.luminance = function (color, luminance) {
        var red = Math.max(0, Math.min(1, color.r + luminance));
        var green = Math.max(0, Math.min(1, color.g + luminance));
        var blue = Math.max(0, Math.min(1, color.b + luminance));
        return new THREE.Color(red, green, blue);
    };

    return Color;

});
