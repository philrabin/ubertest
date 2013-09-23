define([
    'backbone',
    'underscore',
    'app/models/TruckLocationModel'],
    function (Backbone, _, TruckLocationModel) {

    var callbackName = 'jsonCallback';

    return Backbone.Collection.extend({
        model: TruckLocationModel,
        url: 'http://data.sfgov.org/resource/rqzj-sfat.json?$jsonp=' + callbackName,
        sync: function(method, collection, options) {
            // Intercept the sync method to append the jsonp params
            _.extend(options, {
                dataType: 'jsonp',
                jsonp: false,
                jsonpCallback: callbackName
            });
            return Backbone.Collection.prototype.sync.apply(this, arguments);
        }
    });
});
