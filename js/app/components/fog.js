/**
 * Created by Alberto on 05/01/2016.
 */
define(['initializers/webgl', 'GLMatrix'], function (webgl, GLMatrix) {
  var gl = webgl.getContext();
  var vec2 = GLMatrix.vec2;
  var vec3 = GLMatrix.vec3;

  var instance = null;

  function Fog() {
    if (instance) {
      throw new Error('Fog: One fog per scene, please, use getInstance() instead');
    }
    this.color = Fog.DEFAULT_COLOR;
    this.start = Fog.DEFAULT_START;
    this.end = Fog.DEFAULT_END;
  }

  Fog.DEFAULT_COLOR = vec3.fromValues(1.0, 1.0, 1.0);
  Fog.DEFAULT_START = 50;
  Fog.DEFAULT_END = 100;

  Fog.prototype = {
    changeColor: function(color) {
      this.color = vec3.fromValues(color[0], color[1], color[2]);
    },
    setStart: function(start) {
      this.start = start;
    },
    setEnd: function(end) {
      if (end < this.start) {
        throw new Error('Fog: End must be greater than start');
      }
      this.end = end;
    },
    addToObject: function(program) {
      var fogColor = program.getUniform('u_FogColor');
      var fogDist = program.getUniform('u_FogDist');

      gl.uniform3fv(fogColor, this.color);
      gl.uniform2fv(fogDist, vec2.fromValues(this.start, this.end));
    }
  };

  Fog.getInstance = function () {
    if (!instance) {
      instance = new Fog();
    }
    return instance;
  }
});