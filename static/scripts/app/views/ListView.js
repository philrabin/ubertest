define(['backbone',
    'underscore',
    'hbs!templates/list-view',
    'hbs!templates/list-item'
], function(Backbone, _, listViewTmpl, listItemTmpl){
    return Backbone.View.extend({
        initialize: function() {
             this.listenTo(this.collection, 'reset', this.onCollectionReset);
        },

        className: 'list-view',

        events: {
            'click .list-item': 'onListItemClick'
        },

        render: function(){
            this.$el.html(listViewTmpl());
            return this;
        },

        onCollectionReset: function(){
            this.$el.show();
            var list = this.$('.list').empty();
            this.collection.each(_.bind(function(truck){
                var listItem = $(listItemTmpl({
                    name: truck.get('applicant'),
                    desc: truck.get('fooditems')
                }));
                listItem.data('truck', truck);
                list.append(listItem);
            }, this));
        },

        onListItemClick: function(event){
            var truck = $(event.currentTarget).data('truck');
            truck.trigger('select');
        }


    });
});
