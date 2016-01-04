/**
 * Created by Alberto on 01/01/2016.
 */
define(function () {
  function degreesToRadians(deg) {
    return deg * (Math.PI / 180);
  }

  function radiansToDegrees(rad) {
    return (rad*180) / Math.PI;
  }

  return {
    degreesToRadians: degreesToRadians,
    radiansToDegrees: radiansToDegrees
  };
});