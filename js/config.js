/**
 * Created by Alberto on 30/12/2015.
 *
 * Config file for RequireJS
 */

var require = {
    baseUrl: 'js/app',
    shim: {
        'ImprovedNoise': { exports: 'ImprovedNoise' },
        'stats': { exports: 'Stats' },
        'WebGLUtils': { exports: 'WebGLUtils' },
        'WebGLDebugUtils': { exports: 'WebGLDebugUtils' }
    },
    paths: {
        // Utilities
        ImprovedNoise: '../lib/ImprovedNoise',
        stats: '../lib/stats',
        WebGLUtils: '../lib/webgl-utils',
        WebGLDebugUtils: '../lib/webgl-debug',
        GLMatrix: '../lib/gl-matrix',
        // RequireJS libraries
        text: '../lib/text',
        shader: '../lib/shader',
        // Shortcuts
        shaders: '../../shaders'
    }
};