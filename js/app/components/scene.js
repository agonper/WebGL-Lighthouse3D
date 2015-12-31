/**
 * Created by Alberto on 31/12/2015.
 */
define(['initializers/webgl', 'programs/directional-light', 'utils/model', 'models/templates/cube', 'GLMatrix'],
  function(webgl, directionalLight, Model, Cube, GLMatrix) {
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

        var cube = new Model(Cube.vertices, Cube.indices);

        var mvpMatrix = mat4.create();
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