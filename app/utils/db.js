var mongoose = require('mongoose');

module.exports = {

    // List all resources from a collection
    list: function(model, cb) {
        model.find({}, cb);
    },

    // Get a resource from a collection
    get: function(model, id, cb) {
        model.findById(id, cb);
    },

    // Delete a resource from a collection
    del: function(model, id, cb) {
        model.findByIdAndRemove(id, cb);
    },

    // Update a resource from a collection
    put: function(model, id, data, cb) {
        model.findByIdAndUpdate(id, data, { multi: false }, cb);
    },

    // Add a new resource to a collection
    post: function(model, data, cb) {
        new model(data).save(cb);
    },

    search: function(model, params, cb) {
        model.find(params, cb);
    }
};
