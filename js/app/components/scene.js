/**
 * Created by Alberto on 31/12/2015.
 */
define(['initializers/webgl', 'GLMatrix', 'components/camera', 'utils/texture-storage', 'components/terrain'],
  function(webgl, GLMatrix, Camera, TextureStorage, Terrain) {
    var gl = webgl.getContext();
    var vec3 = GLMatrix.vec3;

    var instance = null;

    function Scene() {
      this.sceneObjects = [];
      this.animatedObjects = [];

      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 1);

      // Load textures
      var textureStorage = TextureStorage.getInstance();
      //Terrain textures
      textureStorage.storeTexture('terrain/texture.png', 0);
      textureStorage.storeTexture('terrain/normals.png', 1);
      textureStorage.storeTexture('terrain/heightmap.png', 2);

      // Scene camera
      this.camera = Camera.getInstance();
      this.camera.moveTo(vec3.fromValues(0, 52, 6));
      this.camera.setMovementSpeedRatio(5);
      this.camera.setRotationSpeedRatio(5);

      // Scene objects
      this.sceneObjects.push(new Terrain());
    }

    Scene.prototype = {
      draw: function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.camera.update();

        this.sceneObjects.forEach(function(object) {
          object.draw();
        })
      },
      animate: function() {
        this.animatedObjects.forEach(function(object) {
          object.animate();
        });
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