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
  'models/big-palm-tree',
  'models/little-palm-tree',
  'models/standard-tree',
  'components/ambient-light',
  'components/sun-light',
  'components/fog'
], function (webgl, GLMatrix, ImprovedNoise, Program, vShader, fShader, Camera, Model, bigPalmTree, littlePalmTree, standardTree, AmbientLight, SunLight, Fog) {
  var gl = webgl.getContext();
  var mat4 = GLMatrix.mat4;
  var vec4 = GLMatrix.vec4;

  function Forest(terrainSize) {
    var _this = this;

    _this.loaded = false;
    _this.extention = Forest.DEFAULT_EXTENTION;
    _this.exclusionArea = Forest.DEFAULT_EXCLUSION_AREA;
    _this.trees = [];

    _this.camera = Camera.getInstance();
    _this.program = new Program(vShader.value, fShader.value);
    //_this.model = new Model(cube.vertices, cube.indices);
    _this.models = [
      new Model(standardTree.vertices, standardTree.indices),
      new Model(bigPalmTree.vertices, bigPalmTree.indices),
      new Model(littlePalmTree.vertices, littlePalmTree.indices),
    ];

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
          var worldX = x - terrainSize/2.0;
          var worldZ = z - terrainSize/2.0;
          if (!_this._pointIsExcluded(worldX, worldZ)) {
            var worldY = heights[x + z * terrainSize] * (terrainSize / 10.0);
            var noiseValue = perlin.noise(worldX, worldY, worldZ);

            if (noiseValue >= 0.01 && noiseValue < 0.1) {
              var tree = {
                coords: {
                  x: worldX,
                  y: worldY,
                  z: worldZ
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
      }
      _this.loaded = true;
    };
    img.src = 'textures/terrain/heightmap.png';
  }

  Forest.DEFAULT_EXTENTION = {
    xMin: 10,
    zMin: 10,
    xMax: 500,
    zMax: 140
  };

  Forest.DEFAULT_EXCLUSION_AREA = {
    xMin: -20,
    xMax: 20
  };

  //var colors = {
  //  '0': vec4.fromValues(0.15, 0.68, 0.38, 1.0),
  //  '1': vec4.fromValues(0.54, 0.60, 0.36, 1.0),
  //  '2': vec4.fromValues(0.29, 0.36, 0.14, 1.0)
  //};

  Forest.prototype = {
    draw: function () {
      if (this.loaded) {
        this.program.enable();

        // View & Projection matrices
        var vpMatrix = mat4.create();
        var viewMatrix = this.camera.getViewMatrix();
        var projMatrix = this.camera.getProjectionMatrix();
        mat4.multiply(vpMatrix, projMatrix, viewMatrix);
        var mvpMatrix = mat4.create();

        // Lights
        AmbientLight.getInstance().addToObject(this.program);
        SunLight.getInstance().addToObject(this.program);

        // Fog
        Fog.getInstance().addToObject(this.program);

        var attributes = { size: 9, normals: { position: 3 }, colors: { position: 6 } };
        var normalMatrix = mat4.create();

        var _this = this;
        this.trees.forEach(function(tree) {
          // Model matrix
          var modelMatrix = mat4.create();
          mat4.translate(modelMatrix, modelMatrix, [tree.coords.x, tree.coords.y, tree.coords.z]);
          mat4.scale(modelMatrix, modelMatrix, [8, 8, 8]);

          // Normal matrix
          mat4.invert(normalMatrix, modelMatrix);
          mat4.transpose(normalMatrix, normalMatrix);
          mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);
          var normalMatLoc = _this.program.getUniform('u_NormalMatrix');
          gl.uniformMatrix4fv(normalMatLoc, false, normalMatrix);

          _this.models[tree.type].draw(_this.program, mvpMatrix, attributes);
        });
      }
    },
    _pointIsExcluded: function(x, z) {
      return x >= this.exclusionArea.xMin && x <= this.exclusionArea.xMax;
    }
  };

  return Forest;
});