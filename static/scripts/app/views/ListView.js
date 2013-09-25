define([
    'backbone',
    'underscore',
    'hbs!templates/list-view',
    'app/views/ListItemView'
], function(Backbone, _, listViewTmpl, ListItemView){
    /**
     * Container around a list of truck locations
     * takes a TruckLocationCollection
     * @class
     */
    return Backbone.View.extend({
        initialize: function() {
            this.listItems = [];
            this.listenTo(this.collection, 'reset', this.onCollectionReset);
        },

        className: 'list-view',

        /**
         * render the outer container
         * and wait for reset event
         * @public
         * @returns {Backbone.View}
         */
        render: function(){
            this.$el.html(listViewTmpl());
            return this;
        },

        /**
         * render the list of locations when the list is reset
         * @private
         */
        onCollectionReset: function(){
            var list = this.$('.list');

            // clear items
            _.each(this.listItems, function(listItem){
                listItem.remove();
            });
            this.listItems = [];

            // add an item for each truck location
            this.collection.each(_.bind(function(truck){
                var listItem = new ListItemView({model: truck});
                list.append(listItem.render().el);
                this.listItems.push(listItem);
            }, this));

            // show the whole list
            this.$el.show();
        }
    });
});
