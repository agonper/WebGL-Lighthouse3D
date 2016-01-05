/**
 * Created by Alberto on 05/01/2016.
 */
define(['initializers/webgl', 'GLMatrix', 'utils/trigonometry'], function (webgl, GLMatrix, Trigonometry) {
  var gl = webgl.getContext();
  var vec3 = GLMatrix.vec3;
  var mat4 = GLMatrix.mat4;

  var instance = null;

  // Sun light class
  function SunLight() {
    if (instance) {
      throw new Error('AmbientLight: This object must be unique');
    }
    this.lightColor = SunLight.DEFAULT_LIGHT_COLOR;
    this.lightPosition = SunLight.DEFAULT_LIGHT_POSITION;
    this.lightTarget = SunLight.DEFAULT_LIGHT_TARGET;

    this.lightDirection = vec3.create();
    this.lastCall = Date.now();
    this.elevation = 0.0;
    this.animate();
  }
  SunLight.DEFAULT_LIGHT_COLOR = vec3.fromValues(1.0, 1.0, 1.0);
  SunLight.DEFAULT_LIGHT_POSITION = vec3.fromValues(-5.0, -5.0, 5.0);
  SunLight.DEFAULT_LIGHT_TARGET = vec3.fromValues(0.0, 0.0, 0.0);
  SunLight.DEFAULT_ANGLE_STEP = Trigonometry.degreesToRadians(5.0);

  SunLight.prototype = {
    setColor: function(color) {
      this.lightColor = vec3.fromValues(color[0], color[1], color[2]);
    },
    setPosition: function(position) {
      this.lightPosition = vec3.fromValues(position[0], position[1], position[2]);
      this.animate();
    },
    setTarget: function(target) {
      this.lightTarget = vec3.fromValues(target[0], target[1], target[2]);
      this.animate();
    },
    animate: function() {
      var now = Date.now();
      var elapsed = now - this.lastCall;
      this.lastCall = now;
      this.elevation = this.elevation + SunLight.DEFAULT_ANGLE_STEP * elapsed / 1000.0;

      var matrix = mat4.create();
      mat4.rotateX(matrix, matrix, this.elevation);

      var translatedPosition = vec3.create();
      vec3.transformMat4(translatedPosition, this.lightPosition, matrix);

      var lightDir = vec3.create();
      vec3.negate(lightDir, translatedPosition);
      vec3.add(lightDir, this.lightTarget, lightDir);
      vec3.normalize(this.lightDirection, lightDir);
    },
    addToObject: function(program) {
      var lightColor = program.getUniform('u_LightColor');
      var lightDirection = program.getUniform('u_LightDirection');

      gl.uniform3fv(lightColor, this.lightColor);
      gl.uniform3fv(lightDirection, this.lightDirection);
    }
  };

  SunLight.getInstance = function () {
    if (!instance) {
      instance = new SunLight();
    }
    return instance;
  };

  return SunLight;
});