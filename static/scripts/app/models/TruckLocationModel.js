define(['backbone'], function(Backbone){
    return Backbone.Model.extend({

        idAttribute: 'objectid',

        lat: function(){
            return parseFloat(this.get('latitude'));
        },

        lng: function(){
            return parseFloat(this.get('longitude'));
        }
    });
});
