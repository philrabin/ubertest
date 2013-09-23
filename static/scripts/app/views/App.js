define([
    'backbone',
    'underscore',
    'app/views/MapView',
    'text!templates/app.html',
    'truckLocations'
], function(Backbone, _, MapView, html, truckLocations) {
    return Backbone.View.extend({
        initialize: function () {
            this.$el.html(html);
            this.mapView = new MapView();
            this.$('.main').html(this.mapView.render().el);

            this.listenTo(truckLocations, 'sync', this.onTruckLocationsSync);
            truckLocations.fetch();
        },

        onTruckLocationsSync: function(){
            console.log('on truck locations sync', arguments);
        },

        el: '#app'
    });
});
