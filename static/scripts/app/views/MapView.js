define(['backbone',
    'underscore',
    'text!templates/map-view.html',
    'goog!maps,3,other_params:sensor=false&key=AIzaSyDzkmLdG8unbDJ23RYQ56DlYbnS1eBCNcQ'
], function(Backbone, _, html, goog) {
    return Backbone.View.extend({
        initialize: function() {
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
            this.loadMap(37.7898263, -122.4012879);
        },

        loadMap: function (latitude, longitude){
            var mapOptions = {
                zoom: 13,
                center: new google.maps.LatLng(latitude, longitude),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map(this.$('.map-canvas')[0], mapOptions);
            google.maps.event.addListener(this.map, 'bounds_changed', _.bind(this.onBoundsChange, this));
            window._map = this.map;
        },

        onBoundsChange: function(){
            this.trigger('change:bounds');
        }
    })
});
