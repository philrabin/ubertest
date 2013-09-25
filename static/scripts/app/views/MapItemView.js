define([
    'backbone',
    'underscore'
], function(Backbone, _){
    /**
     * Wrapper around a google maps marker
     * takes a TruckLocationModel and a google map instance
     * @class
     */
    return Backbone.View.extend({
        initialize: function() {
            this.smallIcon = '/img/truck-icon-16.png';
            this.largeIcon = '/img/truck-icon-32.png';

            this.listenTo(this.model, 'list:focus', this.onListItemFocus);
            this.listenTo(this.model, 'list:blur', this.onListItemBlur);
        },

        /**
         * render a marker and hook up events
         * @returns {Backbone.View}
         * @public
         */
        render: function(){
            var latLng = new google.maps.LatLng(this.model.lat(), this.model.lng());

            this.marker = new google.maps.Marker({
                position: latLng,
                map: this.options.map,
                icon: this.smallIcon
            });

            google.maps.event.addListener(this.marker, 'click', _.bind(this.onClick, this));
            google.maps.event.addListener(this.marker, 'mouseover', _.bind(this.onMouseOver, this));
            google.maps.event.addListener(this.marker, 'mouseout', _.bind(this.onMouseOut, this));
            return this;
        },

        /**
         * remove the marker and the $el
         * @public
         */
        destroy: function(){
            this.marker.setMap(null);
            this.remove();
        },

        /**
         * the icon was clicked so notify out
         * @private
         */
        onClick: function(){
            this.model.trigger('marker:select');
        },

        /**
         * the associated list item was moused over
         * @private
         */
        onListItemFocus: function(){
            this.marker.setIcon(this.largeIcon);
        },

        /**
         * the associated list item was moused out
         * @private
         */
        onListItemBlur: function(){
            this.marker.setIcon(this.smallIcon);
        },

        /**
         * marker was moused in
         * @private
         */
        onMouseOver: function(){
            this.onListItemFocus();
            this.model.trigger('marker:focus');
        },

        /**
         * marker was moused out
         * @private
         */
        onMouseOut: function(){
            this.onListItemBlur();
            this.model.trigger('marker:blur');
        }
    });
});
