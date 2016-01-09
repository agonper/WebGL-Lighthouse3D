/**
 * Created by Alberto on 09/01/2016.
 *
 * Special thanks to Tanner Helland for his algorithm
 */
define(function () {
  function kelvinToRGB(kelvin) {
    var k = kelvin / 100;
    var red, green, blue;

    // Red component
    if (k <= 66) {
      red = 255;
    } else {
      red = 329.698727446 * Math.pow(k - 60, -0.1332047592);
    }

    // Green component
    if (k <= 66) {
      green = 99.4708025861 * Math.log(k) - 161.1195681661;
    } else {
      green = 288.1221695283 * Math.pow(k - 60, -0.0755148492)
    }

    // Blue component
    if (k >= 66) {
      blue = 255;
    } else {
      if (k <= 19) {
        blue = 0;
      } else {
        blue = 138.5177312231 * Math.log(k - 10) - 305.0447927307;
      }
    }

    // Check out of limits
    red = (red < 0) ? 0 : red;
    green = (green < 0) ? 0 : green;
    blue = (blue < 0) ? 0 : blue;

    red = (red > 255) ? 255 : red;
    green = (green > 255) ? 255 : green;
    blue = (blue > 255) ? 255 : blue;

    return [red/255, green/255, blue/255];
  }

  return {
    kelvinToRGB: kelvinToRGB
  };
});