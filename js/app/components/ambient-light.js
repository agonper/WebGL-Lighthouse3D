/**
 * Created by Alberto on 05/01/2016.
 */
define(['initializers/webgl', 'GLMatrix'], function (webgl, GLMatrix) {
  var gl = webgl.getContext();
  var vec3 = GLMatrix.vec3;

  var instance = null;

  // Ambient light class
  function AmbientLight() {
    if (instance) {
      throw new Error('AmbientLight: This object must be unique');
    }
    this.lightLevel = AmbientLight.DEFAULT_LIGHT_LEVEL;
  }
  AmbientLight.DEFAULT_LIGHT_LEVEL = vec3.fromValues(0.1, 0.1, 0.1);

  AmbientLight.prototype = {
    setLevel: function(level) {
      this.lightLevel = vec3.fromValues(level[0], level[1], level[2]);
    },
    addToObject: function(program) {
      var ambientLight = program.getUniform('u_AmbientLight');
      gl.uniform3fv(ambientLight, this.lightLevel);
    }
  };

  AmbientLight.getInstance = function () {
    if (!instance) {
      instance = new AmbientLight();
    }
    return instance;
  };

  return AmbientLight;
});