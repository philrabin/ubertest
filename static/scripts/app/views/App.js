define([
    'backbone',
    'underscore',
    'app/views/MapView',
    'app/views/ListView',
    'app/collections/TruckLocationCollection',
    'hbs!templates/app'
], function(Backbone, _, MapView, ListView, TruckLocationCollection, html) {
    return Backbone.View.extend({
        initialize: function () {
            this.$el.html(html);

            this.mainCollection = new TruckLocationCollection();
            this.filterCollection = new TruckLocationCollection();

            this.mapView = new MapView({collection: this.filterCollection});
            this.$('.main').append(this.mapView.render().el);

            this.listView = new ListView({collection: this.filterCollection});
            this.$('.main').append(this.listView.render().el);

            this.listenTo(this.mainCollection, 'sync', this.onTruckLocationsSync);
            this.listenTo(this.mapView, 'change:bounds', this.onMapChangeBounds);
        },

        el: '#app',

        onMapChangeBounds: function(){
            if(!this.mainCollection.length){
                this.mainCollection.fetch();
            } else {
                this.filterLocations();
            }
        },

        onTruckLocationsSync: function(){
            this.filterLocations();
        },

        filterLocations: function(){
            var bounds = this.mapView.map.getBounds();
            var trucksInBounds = this.mainCollection.filter(function(truck){
                var point = new google.maps.LatLng(truck.lat(), truck.lng());
                return bounds.contains(point);
            });
            this.filterCollection.reset(trucksInBounds);
        }
    });
});
