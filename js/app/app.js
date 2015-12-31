/**
 * Created by Alberto on 30/12/2015.
 *
 * App main code, app is unique
 */
define(['initializers/stats', 'components/scene'], function (stats, scene) {

  function generateFrame() {
    scene.animate();
    scene.draw();
  }

  var App = {};

  App.initialize = function () {
    scene.draw();
  };

  App.animate = function () {
    stats.update(generateFrame);
    requestAnimationFrame(App.animate);
  };

  return App;
});