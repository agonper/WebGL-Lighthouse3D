/**
 * Created by Alberto on 31/12/2015.
 */
define([
  'initializers/webgl',
  'components/camera',
  'utils/texture-storage',
  'components/ambient-light',
  'components/sun-light',
  'components/fog',
  'components/terrain',
  'components/lighthouse',
  'components/forest'
  ],
  function(webgl, Camera, TextureStorage, AmbientLight, SunLight, Fog, Terrain, Lighthouse, Forest) {
    var RENDER_DISTANCE = 350.0;
    var MAP_SIZE = 512.0;

    var gl = webgl.getContext();

    var instance = null;

    function Scene() {
      this.sceneObjects = [];
      this.animatedObjects = [];

      gl.enable(gl.DEPTH_TEST);

      // Load textures
      var textureStorage = TextureStorage.getInstance();
      //  Terrain textures
      textureStorage.storeTexture('terrain/texture.png', 0);
      textureStorage.storeTexture('terrain/normals.png', 1);
      textureStorage.storeTexture('terrain/heightmap.png', 2);

      // Scene camera
      this.camera = Camera.getInstance();
      this.camera.moveTo([0, 52, 6]);
      this.camera.setMovementSpeedRatio(5);
      this.camera.setRotationSpeedRatio(5);
      this.camera.setFarPlane(RENDER_DISTANCE);

      // Lights
      var ambientLight = AmbientLight.getInstance();
      ambientLight.setLevel([0.2, 0.2, 0.2]);

      var sunLight = SunLight.getInstance();
      sunLight.setPosition([3.0, -10.0, 2.5]);

      // Fog
      var fog = Fog.getInstance();
      var fogColor = [0.7, 0.7, 0.7];
      fog.changeColor(fogColor);
      fog.setStart(150);
      fog.setEnd(RENDER_DISTANCE);

      gl.clearColor(fogColor[0], fogColor[1], fogColor[2], 1);

      // Scene objects
      this.sceneObjects.push(new Terrain(MAP_SIZE));
      var sceneLighthouse = new Lighthouse();
      this.sceneObjects.push(sceneLighthouse);
      this.sceneObjects.push(new Forest(MAP_SIZE));

      // Animated scene objects
      this.animatedObjects.push(sunLight);
      this.animatedObjects.push(sceneLighthouse);
    }

    Scene.prototype = {
      draw: function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.sceneObjects.forEach(function(object) {
          object.draw();
        })
      },
      animate: function() {
        this.camera.update();

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