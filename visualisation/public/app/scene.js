/**
 * @author Monica Olejniczak
 */
define(['threejs'], function (THREE) {

    'use strict';

    /**
     * Initialises the scene.
     *
     * @param [scene] The scene object.
     * @constructor
     */
    var Scene = function (scene) {
        this.scene = scene || new THREE.Scene();
        this.sphereSize = 5;
    };

    Scene.prototype.constructor = Scene;

    /**
     * Adds a directional light to the scene given the options.
     *
     * @param options The configuration for the directional light.
     * @returns {THREE.DirectionalLight} The directional light that was created.
     */
    Scene.prototype.addDirectionalLight = function (options) {
        // Create the directional light
        var directionalLight = new THREE.DirectionalLight(options.color || 0xffffff, options.intensity || 0.5);
        // Get the position from the options
        var position = options.position;
        // Check of the position exists and set it
        if (position) {
            directionalLight.position.set(position.x, position.y, position.z);
        }
        // Get the target from the options
        var target = options.target;
        // Set the target of the directional light
        directionalLight.target.position.set(target.x || 0, target.y || 0, target.z || 0);
        // Check if the light is being displayed
        if (options.display) {
            // Create the point light helper and add it to the scene
            this.scene.add(new THREE.DirectionalLightHelper(directionalLight, this.sphereSize));
        }
        // Add the directional light to the scene and return it
        return this.add(directionalLight);
    };

    /**
     * Adds a point light to the scene given the options.
     *
     * @param options The configuration for the point light.
     * @returns {THREE.PointLight} The point light that was created.
     */
    Scene.prototype.addPointLight = function (options) {
        // Create the point light
        var pointLight = new THREE.PointLight(options.color || 0xffffff, options.intensity || 1, options.distance || 0);
        // Get the position from the options
        var position = options.position;
        // Check if the position exists and set it
        if (position) {
            pointLight.position.set(position.x, position.y, position.z);
        }
        // Check if the light is being displayed
        if (options.display) {
            // Create the point light helper and add it to the scene
            this.scene.add(new THREE.PointLightHelper(pointLight, this.sphereSize));
        }
        // Add the point light to the scene and return it
        return this.add(pointLight);
    };

    /**
     * Adds an object to the scene.
     *
     * @param object The object being added to the scene.
     * @returns {*} The object that was added to the scene.
     */
    Scene.prototype.add = function (object) {
        this.scene.add(object);
        return object;
    };

    return Scene;

});
