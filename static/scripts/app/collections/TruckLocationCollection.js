define([
    'backbone',
    'app/models/TruckLocationModel'],
    function(Backbone, TruckLocationModel){
    return Backbone.Collection.extend({
        model: TruckLocationModel,
        url: '/truck-locations'
    });
});
