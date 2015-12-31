/**
 * Created by Alberto on 30/12/2015.
 *
 * App main code, app is unique
 */
define(['initializers/stats'], function (stats) {

  function a() {
    var sum = 0;
    for (var i = 0; i < 100000; i++) {
      sum += i;
    }
    //console.log('SUM:', sum);
  }

  var App = {};

  App.initialize = function () {
    console.log('Hey there! This seems working');
  };

  App.animate = function () {
    stats.update(a);
    requestAnimationFrame(App.animate);
  };

  return App;
});