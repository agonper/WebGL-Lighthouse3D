/**
 * Created by Alberto on 04/01/2016.
 *
 * FPS camera for moving around the scene
 */
define(['initializers/webgl', 'GLMatrix', 'utils/trigonometry'], function (webgl, GLMatrix, Trigonometry) {
  var mat4 = GLMatrix.mat4;
  var vec3 = GLMatrix.vec3;

  var canvas = webgl.getCanvas();

  var instance = null;

  // Keys
  var upPressed = false;
  var downPressed = false;
  var rightPressed = false;
  var leftPressed = false;

  function Camera() {
    if (instance) {
      throw new Error('Camera: This is a singleton class, please use getInstance() instead');
    }
    this.viewmatrix = mat4.create();

    this.azimuth = Camera.DEFAULT_AZIMUTH;
    this.elevation = Camera.DEFAULT_ELEVATION;

    this.position = vec3.fromValues(0, 0, -20);
    this.lookAt = vec3.fromValues(0, 0, 0);
    this.up = vec3.fromValues(0, 1, 0);

    this.speedRatio = Camera.DEFAULT_MOVEMENT_SPEED_RATIO;
    this.rotationRatio = Camera.DEFAULT_ROTATION_SPEED_RATIO;

    // Listeners
    //  Keyboard
    var _this = this;
    document.addEventListener('keydown', function(ev) {
      _this.onKeyDown(_this, ev);
    });
    document.addEventListener('keyup', function(ev) {
      _this.onKeyUp(_this, ev);
    });

    //  Mouse
    var pointerLock = false;
    canvas.addEventListener('click', function() {
      canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock ||
        canvas.webkitRequestPointerLock;
      canvas.requestPointerLock();
    });
    document.addEventListener('pointerlockchange', pointerLockChange, false);
    document.addEventListener('mozpointerlockchange', pointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
    function pointerLockChange() {
      pointerLock = !!(document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas ||
      document.webkitPointerLockElement === canvas);
    }
    document.addEventListener('mousemove', function(ev) {
      if (pointerLock) {
        _this.onMouseMove(_this, ev);
      }
    });

    // Projection
    this.projMatrix = mat4.create();
    this.farPlane = Camera.DEFAULT_FAR_PLANE;
    this.fov = Camera.DEFAULT_FOV;
    mat4.perspective(this.projMatrix, this.fov, canvas.width / canvas.height, 0.1, this.farPlane);
  }

  Camera.DEFAULT_AZIMUTH = Trigonometry.degreesToRadians(90);
  Camera.DEFAULT_ELEVATION = Trigonometry.degreesToRadians(90);
  Camera.DEFAULT_MOVEMENT_SPEED_RATIO = 1;
  Camera.DEFAULT_ROTATION_SPEED_RATIO = 1;
  Camera.DEFAULT_FAR_PLANE = 500.0;
  Camera.DEFAULT_FOV = Trigonometry.degreesToRadians(35);

  Camera.prototype = {
    setMovementSpeedRatio: function(ratio) {
      this.speedRatio = ratio;
    },
    setRotationSpeedRatio: function (ratio) {
      this.rotationRatio = ratio;
    },
    moveTo: function(position) {
      this.azimuth = Camera.DEFAULT_AZIMUTH;
      this.elevation = Camera.DEFAULT_ELEVATION;
      this.position = vec3.clone(position);
    },
    setFarPlane: function(distance) {
      this.farPlane = distance + 25.0;
      mat4.perspective(this.projMatrix, this.fov, canvas.width / canvas.height, 0.1, this.farPlane);
    },
    onMouseMove: function(context, ev) {
      context.azimuth += ev.movementX*0.002;
      context.elevation += ev.movementY*0.002;
    },
    onKeyDown: function(context, ev) {
      if(ev.keyCode==39) //DER
        context.azimuth += this.rotationRatio * 0.01;

      if(ev.keyCode==37) //IZQ
        context.azimuth -= this.rotationRatio * 0.01;

      if(ev.keyCode==38) //ARR
        context.elevation -= this.rotationRatio * 0.01;

      if(ev.keyCode==40) //ABA
        context.elevation += this.rotationRatio * 0.01;


      if(ev.keyCode==87) //W
        upPressed = true;

      if(ev.keyCode==83) //S
        downPressed = true;

      if(ev.keyCode==65) //A
        leftPressed = true;

      if(ev.keyCode==68) //D
        rightPressed = true;
    },
    onKeyUp: function (context, ev) {
      if(ev.keyCode==87) //W
        upPressed = false;

      if(ev.keyCode==83) //S
        downPressed = false;

      if(ev.keyCode==65) //A
        leftPressed = false;

      if(ev.keyCode==68) //D
        rightPressed = false;
    },
    update: function() {
      var dirLookX = Math.sin(this.elevation)*Math.cos(this.azimuth);
      var dirLookY = Math.cos(this.elevation);
      var dirLookZ = Math.sin(this.elevation)*Math.sin(this.azimuth);

      var dirLook = vec3.fromValues(dirLookX, dirLookY, dirLookZ);

      var dirRight = vec3.create();
      vec3.cross(dirRight, dirLook, this.up);

      if (upPressed)
      {
        this.position[0] += this.speedRatio * 0.1* dirLookX;
        this.position[1] += this.speedRatio * 0.1 * dirLookY;
        this.position[2] += this.speedRatio * 0.1 * dirLookZ;
      }

      if (downPressed)
      {
        this.position[0] -= this.speedRatio * 0.1 * dirLookX;
        this.position[1] -= this.speedRatio * 0.1 * dirLookY;
        this.position[2] -= this.speedRatio * 0.1 * dirLookZ;
      }

      if (rightPressed) {
        this.position[0] += this.speedRatio * 0.1 * dirRight[0];
        this.position[1] += this.speedRatio * 0.1 * dirRight[1];
        this.position[2] += this.speedRatio * 0.1 * dirRight[2];
      }

      if (leftPressed) {
        this.position[0] -= this.speedRatio * 0.1 * dirRight[0];
        this.position[1] -= this.speedRatio * 0.1 * dirRight[1];
        this.position[2] -= this.speedRatio * 0.1 * dirRight[2];
      }

      this.lookAt[0] = this.position[0] + dirLookX;
      this.lookAt[1] = this.position[1] + dirLookY;
      this.lookAt[2] = this.position[2] + dirLookZ;

      var cameraInfo = document.getElementById('camera-info');
      cameraInfo.innerHTML = 'Observer position: ' + vec3.str(this.position) + '<br>' +
          'Observer looking at: ' + vec3.str(this.lookAt);

      mat4.lookAt(this.viewmatrix, this.position, this.lookAt, this.up);
    },
    getViewMatrix: function () {
      return this.viewmatrix;
    },
    getProjectionMatrix: function() {
      return this.projMatrix;
    },
    getObserverPosition: function() {
      return this.position;
    }
  };

  Camera.getInstance = function () {
    if (!instance) {
      instance = new Camera();
    }
    return instance;
  };

  return Camera;
});