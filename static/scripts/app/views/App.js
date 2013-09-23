define(['backbone',
    'app/collections/TruckLocationCollection',
    'goog!maps,3,other_params:sensor=false'
], function(Backbone, TruckLocationCollection, google) {
    return Backbone.View.extend({
        initialize: function () {
        },

        el: 'body'
    });
});
