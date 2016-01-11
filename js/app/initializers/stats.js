/**
 * Created by Alberto on 30/12/2015.
 *
 * Stats widget instantiator
 *
 * Stats.js is a library which generates a widget for showing some application data:
 *
 * FPS Frames per second
 * MS  Milliseconds
 * MB  MegaBytes
 */

define(['stats'], function (Stats) {
  var instance = null;

  function _Stats() {
    if (instance) {
      throw new Error("Stats.js: Cannot instantiate more than one Stats display, use Stats.getInstance()");
    }
    this.initialize();
  }

  _Stats.prototype = {
    modes: {
      FPS: 0, // Frames per second
      MS: 1, // Milliseconds
      MB: 2 // MegaBytes
    },
    stats: null,
    el: null,
    initialize: function() {
      this.stats = new Stats();
      this.el = this.stats.domElement;
      this.setMode( this.modes.FPS );

      var canvasContainer = document.getElementById('canvas-container');
      canvasContainer.appendChild(this.el);

      this.el.style.position = 'absolute';
      this.el.style.left = '0px';
      this.el.style.top = '0px';
    },
    update: function(monitoredFunction) {
      this.stats.begin();
      monitoredFunction();
      this.stats.end();
    },
    setMode: function(mode) {
      this.stats.setMode(mode);
    }
  };

  _Stats.getInstance = function() {
    if (!instance) {
      instance = new _Stats();
    }
    return instance;
  };

  return _Stats.getInstance();
});