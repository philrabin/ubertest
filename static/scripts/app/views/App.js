define([
    'backbone',
    'underscore',
    'app/views/MapView',
    'app/views/ListView',
    'app/collections/TruckLocationCollection',
    'hbs!templates/app'
], function(Backbone, _, MapView, ListView, TruckLocationCollection, html) {
    /**
     * Main app view
     * @class
     */
    return Backbone.View.extend({
        initialize: function () {
            this.$el.html(html);

            // keep two collections
            // on main one, and one that's filtered on location
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

        /**
         * The map bounds were changed,
         * initially load the list or
         * globally filter the list if already loaded
         * @private
         */
        onMapChangeBounds: function(){
            if(!this.mainCollection.length){
                this.mainCollection.fetch();
            } else {
                this.filterLocations();
            }
        },

        /**
         * initial load of all truck locations
         * @private
         */
        onTruckLocationsSync: function(){
            this.filterLocations();
        },

        /**
         * filter the locations that are in the map bounds
         * @private
         */
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
