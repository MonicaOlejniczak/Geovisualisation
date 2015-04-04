/**
 * @author Monica Olejniczak
 */
define(['threejs', 'scene', 'viewport'], function (THREE, Scene, Viewport) {

    'use strict';

    var canvas;
    var viewport = new Viewport();

    /**
     * Initialises the canvas.
     *
     * @param element The HTML canvas.
     * @param options Configuration options for the canvas.
     * @constructor
     */
    var Canvas = function (element, options) {
        canvas = element;
        this.scene = new Scene();
        this.camera = new THREE.PerspectiveCamera(75, element.width / element.height, 1, 1000);
        var cameraPosition = options.cameraPosition;
        this.camera.position.set(cameraPosition.x || 0, cameraPosition.y || 0, cameraPosition.z || 0);
        this.viewportHeight = viewport.getHeight();
        this.tanFOV = Math.tan(THREE.Math.degToRad(this.camera.fov * 0.5));
        this.renderer = new THREE.WebGLRenderer({
            canvas: element,
            alpha: true,
            antialias: true
        });
        if (options.axes) {
            this.scene.add(this.createAxes());
        }
        if (options.controls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        }
    };

    Canvas.prototype.constructor = Canvas;

    /**
     * A method for creating the coordinate axes.
     *
     * @param [options] The configuration options for the axes.
     * @returns {THREE.Object3D} The world axes.
     */
    Canvas.prototype.createAxes = function (options) {
        // Ensure the options exist
        options = options || {};
        // Get the origin, target, length and axe colours from the options
        var origin = options.origin || new THREE.Vector3(0, 0, 0);
        var target = new THREE.Vector3(0, 0, 0);
        var length = options.length || 1000;
        var xColor = options.xColor || 0xFF0000;
        var yColor = options.yColor || 0x00FF00;
        var zColor = options.zColor || 0x0000FF;
        // Create a container object for the axes
        var axes = new THREE.Object3D();
        // Build each X, Y and Z axis
        axes.add(this.createAxis(origin, target.clone().setX(length), xColor, false)); // +X
        axes.add(this.createAxis(origin, target.clone().setX(-length), xColor, true)); // -X
        axes.add(this.createAxis(origin, target.clone().setY(length), yColor, false)); // +Y
        axes.add(this.createAxis(origin, target.clone().setY(-length), yColor, true)); // -Y
        axes.add(this.createAxis(origin, target.clone().setZ(length), zColor, false)); // +Z
        axes.add(this.createAxis(origin, target.clone().setZ(-length), zColor, true)); // -Z
        // Return the axes
        return axes;
    };

    /**
     * Creates an axis with a specified origin, target and color.
     *
     * @param origin The vector of origin.
     * @param target The target vector.
     * @param color The color of the axis.
     * @param dashed A configuration for whether the axis is a dashed material or not.
     * @returns {THREE.Line}
     */
    Canvas.prototype.createAxis = function (origin, target, color, dashed) {
        var geometry = new THREE.Geometry();
        var material;
        if (dashed) {
            material = new THREE.LineDashedMaterial({
                linewidth: 3,
                color: color,
                dashSize: 3,
                gapSize: 3
            });
        } else {
            material = new THREE.LineBasicMaterial({
                linewidth: 3,
                color: color
            });
        }
        geometry.vertices.push(origin.clone());
        geometry.vertices.push(target.clone());
        geometry.computeLineDistances();
        return new THREE.Line(geometry, material, THREE.LinePieces);
    };

    /**
     * Calculates the texture coordinates for the geometry. This function has the option of replacing the geometry's
     * current texture coordinates.
     *
     * @param geometry The geometry having its texture coordinates calculated.
     * @param [replace] Whether the geometry is having its face vertex uvs replaced.
     */
    Canvas.prototype.calculateTextureCoordinates = function (geometry, replace) {
        // Compute the bounding box for the geometry
        geometry.computeBoundingBox();
        // Initialise the variables
        var boundingBox = geometry.boundingBox,
            max = boundingBox.max,
            min = boundingBox.min,
            offset = new THREE.Vector3(0 - min.x, 0 - min.y, 0 - min.z),
            range = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z),
            vertices = geometry.vertices,
            faces = geometry.faces,
            coordinates = [];
        // Iterate through every face in the geometry
        faces.forEach(function (face) {
            // Get the vertices from the face
            var v1 = vertices[face.a],
                v2 = vertices[face.b],
                v3 = vertices[face.c];
            // Append the new texture coordinates
            coordinates.push([
                new THREE.Vector2((v1.x + offset.x) / range.x, (v1.z + offset.z) / range.z),
                new THREE.Vector2((v2.x + offset.x) / range.x, (v2.z + offset.z) / range.z),
                new THREE.Vector2((v3.x + offset.x) / range.x, (v3.z + offset.z) / range.z)
            ]);
        });
        // Replace the face vertex coordinates if it is being replaced
        if (replace) {
            geometry.faceVertexUvs[0] = coordinates;
        }
    };

    /**
     * A method called on each render. This method updates the camera aspect ratio and the renderer display size.
     */
    Canvas.prototype.resize = function () {
        // Lookup the size the browser is displaying the canvas
        var width = viewport.getWidth();
        var height = viewport.getHeight();
        // Check if the canvas is not the same size
        if (canvas.width != width || canvas.height != height) {
            // Make the canvas the same size
            canvas.width = width;
            canvas.height = height;
            // Update the camera aspect ratio, fov and the renderer size
            this.camera.aspect = width / height;
            this.camera.fov = (360 / Math.PI) * Math.atan(this.tanFOV * (height / this.viewportHeight));
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    };

    /**
     * The rendering function that updates the canvas.
     */
    Canvas.prototype.render = function () {
        this.resize();
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.getScene(), this.camera);
    };

    /**
     * An accessor method that returns the THREE.js scene.
     *
     * @returns {*} The scene object.
     */
    Canvas.prototype.getScene = function () {
        return this.scene.scene;
    };

    /**
     * An accessor method that returns the private canvas element.
     *
     * @returns {*} The HTMl canvas that constructed this class.
     */
    Canvas.prototype.getCanvas = function () {
        return canvas;
    };

    return Canvas;

});
