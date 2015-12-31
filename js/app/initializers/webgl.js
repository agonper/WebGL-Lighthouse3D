/**
 * Created by Alberto on 30/12/2015.
 *
 * WebGL context initializer
 */

define(['WebGLUtils'], function (Utils) {
  var ELEMENT_ID = 'canvas';

  var instance = null;

  function WebGL() {
    if (instance) {
      throw new Error('WebGL Context has been already initialized');
    }
    this.initialize(ELEMENT_ID);
  }

  WebGL.prototype = {
    el: null,
    context: null,
    initialize: function(id) {
      this.el = document.getElementById(id);
      this.context = Utils.create3DContext(this.el);
    },
    getCanvas: function() {
      return this.el;
    },
    getContext: function() {
      return this.context;
    }
  };

  WebGL.getInstance = function() {
    if (!instance) {
      instance = new WebGL();
    }
    return instance
  };

  return WebGL.getInstance();
});