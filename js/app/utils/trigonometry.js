/**
 * Created by Alberto on 01/01/2016.
 */
define(function () {
  function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
  }

  return {
    degreesToRadians: degreesToRadians
  };
});