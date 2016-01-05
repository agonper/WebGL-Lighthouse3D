/**
 * Created by Alberto on 04/01/2016.
 */
define(['initializers/webgl'], function (webgl) {
  var gl = webgl.getContext();
  var instance = null;

  function TextureStorage() {
    if (instance) {
      throw new Error('TextureStorage: This is a singleton class, use getInstance() instead');
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    this.storage = {};

  }

  TextureStorage.prototype = {
    storeTexture: function(uri, textureUnit) {
      var texture = gl.createTexture();

      var image = new Image();
      image.onload = function () {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      };
      image.onfail = function () {
        throw new Error('TextureStorage: No image was found at textures/' + uri);
      };
      image.src = 'textures/' + uri;

      this.storage[uri] = {
        texture: texture,
        texUnit: textureUnit
      }
    },
    retrieveTexture: function(uri) {
      var texture = this.storage[uri];
      if (!texture) {
        throw new Error('TextureStorage: the texture ' + uri + ' was not found on the storage');
      }
      return texture;
    }
  };

  TextureStorage.getInstance = function () {
    if (!instance) {
      instance = new TextureStorage();
    }
    return instance;
  };

  return TextureStorage;
});