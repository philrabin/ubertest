define([
    'backbone',
    'underscore',
    'hbs!templates/map-view',
    'goog!maps,3,other_params:sensor=false&key=AIzaSyDzkmLdG8unbDJ23RYQ56DlYbnS1eBCNcQ'
], function(Backbone, _, html, goog) {

    var SF = {
        lat: 37.7898263,
        lng: -122.4012879
    };

    return Backbone.View.extend({
        initialize: function() {
            this.refreshData = _.debounce(_.bind(this.onRefreshData, this), 250);
            this.listenTo(this.collection, 'reset', this.onTruckLocationsReset);
            this.markers = [];
        },

        className: 'map-view',

        render: function() {
            this.$el.html(html);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(_.bind(this.onGeoLocation, this));
            }

            return this;
        },

        onGeoLocation: function(position){
            this.loadMap(position.coords.latitude, position.coords.longitude)
        },

        onGeoLocationError: function(error) {
            this.loadMap(SF.lat, SF.lng);
        },

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

        onBoundsChange: function(){
            this.refreshData();
        },

        onRefreshData: function(){
            this.trigger('change:bounds');
        },

        onTruckLocationsReset: function(){
            this.clearUnusedMarkers();

            var newMarkers = [];

            this.collection.each(_.bind(function(truck){
                // not a valid lat lng
                if(!_.isNumber(truck.lat()) || !_.isNumber(truck.lng())){
                    return;
                }

                var latLng = new google.maps.LatLng(truck.lat(), truck.lng());

                var exists = _.any(this.markers, function(marker){
                    return marker.truck.id === truck.id;
                });

                if(exists){
                    return;
                }

                var truckMarker = new google.maps.Marker({
                    position: latLng,
                    map: this.map,
                    icon: '/img/truck-icon.png'
                });

                truckMarker.truck = truck;
                newMarkers.push(truckMarker);
            }, this));

            this.markers = this.markers.concat(newMarkers);
        },


        clearUnusedMarkers: function(){
            var bounds = this.map.getBounds();
            var deleted = [];
            _.each(this.markers, _.bind(function(marker){
                if(!marker.position || !bounds.contains(marker.position)) {
                    // delete the marker
                    marker.setMap(null);
                    deleted.push(marker);
                }
            }, this));

            // remove the deleted items from the list of markers
            this.markers = _.without.apply(_, [this.markers].concat(deleted));
        }
    })
});
