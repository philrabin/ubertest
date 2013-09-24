define(['backbone'], function(Backbone){
    return Backbone.Model.extend({
        initialize: function(){
            console.log('new truck location');
        },

        idAttribute: 'objectid',

        lat: function(){
            return parseFloat(this.get('latitude'));
        },

        lng: function(){
            return parseFloat(this.get('longitude'));
        }
    });
});
