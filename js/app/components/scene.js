/**
 * Created by Alberto on 31/12/2015.
 */
define(['initializers/webgl', 'programs/directional-light', 'utils/model', 'models/templates/plane', 'GLMatrix', 'utils/trigonometry'],
  function(webgl, directionalLight, Model, Plane, GLMatrix, Trigonometry) {
    var mat4 = GLMatrix.mat4;
    var vec3 = GLMatrix.vec3;

    var gl = webgl.getContext();
    var canvas = webgl.getCanvas();

    var instance = null;

    function Scene() {
      this.initialize();
    }

    Scene.prototype = {
      animatedObjects: [],
      initialize: function () {
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1);
      },
      draw: function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var cube = new Model(Plane.vertices, Plane.indices);

        var projMatrix = mat4.create();
        mat4.perspective(projMatrix, Trigonometry.degreesToRadians(30), canvas.width / canvas.height, 0.1, 100.0);

        var viewMatrix = mat4.create();
        var eyeFrom = vec3.fromValues(2, 2, 6);
        var lookAt = vec3.fromValues(0, 0, 0);
        var upDirection = vec3.fromValues(0, 1, 0);
        mat4.lookAt(viewMatrix, eyeFrom, lookAt, upDirection);

        var mvpMatrix = mat4.create();
        mat4.multiply(mvpMatrix, projMatrix, viewMatrix);

        cube.draw(directionalLight, mvpMatrix, [1.0, 0.0, 0.0, 1.0]);
      },
      animate: function() {
        this.animatedObjects.forEach(function(object) {
          object.animate();
        });
      },
      addAnimatedObject: function(object) {
        this.animatedObjects.push(object);
      }
    };

    Scene.getInstance = function() {
      if (!instance) {
        instance = new Scene();
      }
      return instance;
    };

    return Scene.getInstance();
});