define([
    'backbone',
    'underscore',
    'hbs!templates/map-view',
    'app/views/MapItemView',
    'goog!maps,3,other_params:sensor=false&key=AIzaSyDzkmLdG8unbDJ23RYQ56DlYbnS1eBCNcQ'
], function(Backbone, _, mapViewTmpl, MapItemView, goog) {

    /**
     * Default lat long for San Francisco
     * location not shared
     * @type {{lat: number, lng: number}}
     */
    var SF = {
        lat: 37.7898263,
        lng: -122.4012879
    };

    /**
     * Wrapper around a google maps instance
     * takes a TruckLocationCollection
     * @class
     */
    return Backbone.View.extend({
        initialize: function() {
            // create a debounced throttle function delegate to
            // prevent too many calls when the bounds change
            this.refreshData = _.debounce(_.bind(this.onRefreshData, this), 250);
            this.listenTo(this.collection, 'reset', this.onTruckLocationsReset);
            this.mapItems = [];
        },

        className: 'map-view',

        /**
         * Wait for geo location before rendering a map
         * if not, then use default location
         * @returns {Backbone.View}
         * @public
         */
        render: function() {
            this.$el.html(mapViewTmpl);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(_.bind(this.onGeoLocation, this));
            }

            return this;
        },

        /**
         * Geo location was successfully granted
         * @param position - geo location lat lng
         * @private
         */
        onGeoLocation: function(position){
            this.loadMap(position.coords.latitude, position.coords.longitude)
        },

        /**
         * Geo location denied from user
         * load SF lat long
         * @param error
         * @private
         */
        onGeoLocationError: function(error) {
            this.loadMap(SF.lat, SF.lng);
        },

        /**
         * Load an instance of google maps
         * @param {Number} latitude
         * @param {Number} longitude
         */
        loadMap: function (latitude, longitude){
            var mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(latitude, longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };
            this.map = new google.maps.Map(this.$('.map-canvas')[0], mapOptions);
            google.maps.event.addListener(this.map, 'bounds_changed',
                _.bind(this.onBoundsChange, this));
        },

        /**
         * The map bounds were change
         * @private
         */
        onBoundsChange: function(){
            this.refreshData();
        },

        /**
         * Notify the app that the map bounds changed
         * @private
         */
        onRefreshData: function(){
            this.trigger('change:bounds');
        },

        /**
         * The truck location collection was reset
         * @private
         */
        onTruckLocationsReset: function(){
            // remove markers that are out of bounds
            this.clearUnusedMarkers();

            var newItems = [];

            // walk through each item in the collection
            this.collection.each(_.bind(function(truck){
                // not a valid lat lng
                if(!_.isNumber(truck.lat()) || !_.isNumber(truck.lng())){
                    return;
                }

                // check to see if it's already on the map
                var exists = _.any(this.mapItems, function(items){
                    return items.model.id === truck.id;
                });

                // return if it exists to prevent duplicated
                if(exists){
                    return;
                }

                // create a wrapper around a maker
                var mapItem = new MapItemView({
                    model: truck,
                    map: this.map
                });

                mapItem.render();
                newItems.push(mapItem);
            }, this));

            // join the new items together with the current
            this.mapItems = this.mapItems.concat(newItems);
        },


        /**
         * Remove markers that aren't in bounds
         * @private
         */
        clearUnusedMarkers: function(){
            var bounds = this.map.getBounds();
            var deleted = [];
            _.each(this.mapItems, _.bind(function(mapItem){
                var marker = mapItem.marker;

                // compare against the current map bounds
                if(!marker.position || !bounds.contains(marker.position)) {
                    // delete the marker
                    mapItem.destroy();
                    deleted.push(mapItem);
                }
            }, this));

            // remove the deleted items from the list of markers
            this.mapItems = _.without.apply(_, [this.mapItems].concat(deleted));
        }
    })
});
