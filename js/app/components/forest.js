/**
 * Created by Alberto on 06/01/2016.
 */
define([
  'initializers/webgl',
  'GLMatrix',
  'ImprovedNoise',
  'utils/program',
  'shader!forest.vert',
  'shader!forest.frag',
  'components/camera',
  'utils/model',
  'models/cube',
  'components/ambient-light',
  'components/sun-light',
  'components/fog'
], function (webgl, GLMatrix, ImprovedNoise, Program, vShader, fShader, Camera, Model, cube, AmbientLight, SunLight, Fog) {
  var gl = webgl.getContext();
  var mat4 = GLMatrix.mat4;

  function Forest(terrainSize) {
    var _this = this;

    _this.loaded = false;
    _this.extention = Forest.DEFAULT_EXTENTION;
    _this.trees = [];

    _this.camera = Camera.getInstance();
    _this.program = new Program(vShader.value, fShader.value);
    _this.model = new Model(cube.vertices, cube.indices);

    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = terrainSize;
      canvas.height = terrainSize;
      var context = canvas.getContext('2d');

      var size = terrainSize * terrainSize;
      var heights = new Float32Array(size);

      context.drawImage(img, 0, 0);
      for (var i = 0; i < size; i++) {
        heights[i] = 0;
      }

      var imgData = context.getImageData(0, 0, terrainSize, terrainSize);
      var pixels = imgData.data;

      var j = 0;
      for (var i = 0; i < pixels.length; i += 4) {
        heights[j++] = pixels[i]/255; // R component from RGBA. Greyscale image, so R == G == B
      }

      var perlin = new ImprovedNoise();
      for (var x = _this.extention.xMin; x <= _this.extention.xMax; x += 10) {
        for (var z = _this.extention.zMin; z <= _this.extention.zMax; z += 10) {
          var y = heights[x + z*terrainSize]*(terrainSize/10.0);
          var noiseValue = perlin.noise(x - terrainSize/2.0, y, z - terrainSize/2.0);

          if (noiseValue >= 0.01 && noiseValue < 0.1) {
            var tree = {
              coords: {
                x: x - terrainSize/2.0,
                y: y,
                z: z - terrainSize/2.0
              }
            };
            if (noiseValue >= 0.09) {
              tree.type = 0;
              _this.trees.push(tree);
            } else if (noiseValue >= 0.05 && noiseValue < 0.06) {
              tree.type = 1;
              _this.trees.push(tree);
            } else if (noiseValue >= 0.01 && noiseValue < 0.02) {
              tree.type = 2;
              _this.trees.push(tree);
            }
          }
        }
      }
      _this.loaded = true;
    };
    img.src = 'textures/terrain/heightmap.png';
  }

  Forest.DEFAULT_EXTENTION = {
    xMin: 10.0,
    zMin: 10.0,
    xMax: 500.0,
    zMax: 140.0
  };

  Forest.prototype = {
    draw: function () {
      if (this.loaded) {
        this.program.enable();

        // View & Projection matrices
        var viewMatrix = this.camera.getViewMatrix();
        var projMatrix = this.camera.getProjectionMatrix();

        // Lights
        AmbientLight.getInstance().addToObject(this.program);
        SunLight.getInstance().addToObject(this.program);

        // Fog
        //Fog.getInstance().addToObject(this.program);

        var attributes = { normals: true };
      }
    }
  };

  return Forest;
});