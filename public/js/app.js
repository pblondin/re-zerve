// Load AMD modules with requirejs
require.config({
    paths : {
        backbone : 'path/to/backbone',
        underscore : 'path/to/underscore',
        jquery : 'path/to/jquery',
        marionette : 'path/to/marionette'
    },
    shim : {
        jquery : {
            exports : 'jQuery'
        },
        underscore : {
            exports : '_'
        },
        backbone : {
            deps : ['jquery', 'underscore'],
            exports : 'Backbone'
        },
        marionette : {
            deps : ['jquery', 'underscore', 'backbone'],
            exports : 'Marionette'
        }
    }
});