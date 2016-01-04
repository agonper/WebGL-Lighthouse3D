/**
 * Created by Alberto on 03/01/2016.
 *
 * Camera object
 */
define(['GLMatrix'], function (GLMatrix) {
  var mat4 = GLMatrix.mat4;
  var vec3 = GLMatrix.vec3;

  var instance = null;

  function Camera() {
    if (instance) {
      throw new Error('A camera instance already exists, please call getInstance() instead');
    }
    this.matrix = mat4.create();
    this.position = vec3.create();
    this.focus = vec3.create();
    this.up = vec3.fromValues(0,1,0);
    this.azimuth = Camera.DEFAULT_AZIMUTH;
    this.elevation = Camera.DEFAULT_ELEVATION;
    this.steps = 0;
    this.home = vec3.create();
  }

  Camera.DEFAULT_AZIMUTH = 0.0;
  Camera.DEFAULT_ELEVATION = 45.0;

  Camera.prototype = {
    goHome: function(homePosition) {
      if (homePosition !== null) {
        this.home = homePosition;
      }

      vec3.set(this.position, this.home[0], this.home[1], this.home[2]);
      this.azimuth = Camera.DEFAULT_AZIMUTH;
      this.elevation = Camera.DEFAULT_ELEVATION;
      this.steps = 0;
      this.update();
    },
    dolly: function(stepCount) {
      this.steps += stepCount;

      var positionX = this.position[0] + this.steps * Math.sin(90 - this.azimuth) * Math.cos(this.elevation);
      var positionY = this.position[1] + this.steps * Math.cos(this.azimuth);
      var positionZ = this.position[2] + this.steps * Math.sin(90 - this.azimuth) * Math.sin(this.elevation);

      var newPosition = vec3.fromValues(positionX, positionY, positionZ);

      this.setPosition(newPosition);
    },
    setPosition: function(position) {
      vec3.set(this.position, position[0], position[1], position[2]);
      this.update();
    },
    setAzimuth: function(azimuth) {
      this.changeAzimuth(azimuth - this.azimuth);
    },
    changeAzimuth: function(azimuth) {
      this.azimuth += azimuth;

      if (this.azimuth > 360 || this.azimuth < -360) {
        this.azimuth = this.azimuth % 360;
      }
      this.update();
    },
    setElevation: function(elevation) {
      this.changeElevation(elevation - this.elevation);
    },
    changeElevation: function(elevation) {
      this.elevation += elevation;

      if (this.elevation > 360 || this.elevation < -360){
        this.elevation = this.elevation % 360;
      }
      this.update();
    },
    update: function() {
      var focusX = (this.steps + 500) * Math.sin(90 - this.azimuth)*Math.cos(this.elevation);
      var focusY = (this.steps + 500) * Math.cos(this.azimuth);
      var focusZ = (this.steps + 500) * Math.sin(90 - this.azimuth)*Math.sin(this.elevation);

      this.focus = vec3.fromValues(focusX, focusY, focusZ);

      mat4.lookAt(this.matrix, this.position, this.focus, this.up);
    },
    getViewMatrix: function() {
      return this.matrix;
    }
  };

  Camera.getInstance = function () {
    if (!instance) {
      instance = new Camera();
    }
    return instance;
  };

  return Camera.getInstance();
});