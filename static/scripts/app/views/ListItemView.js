define([
    'backbone',
    'underscore',
    'hbs!templates/list-item'
], function(Backbone, _, listItemTmpl){
    /**
     * Single truck location list item
     * @class
     */
    return Backbone.View.extend({
        initialize: function() {
            // listen to marker interaction events
            this.listenTo(this.model, 'marker:focus', this.onFocus);
            this.listenTo(this.model, 'marker:blur', this.onBlur);
        },

        className: 'list-item collapsed',

        events: {
            'click': 'onClick',
            'mouseenter': 'onMouseEnter',
            'mouseleave': 'onMouseLeave'
        },

        /**
         * Render a single list item
         * @returns {Backbone.View}
         */
        render: function(){
            var listItem = $(listItemTmpl({
                name: this.model.get('applicant'),
                desc: this.model.get('fooditems'),
                location: this.model.get('locationdescription')
            }));
            this.$el.html(listItem);
            return this;
        },

        /**
         * The list item was clicked so expand details
         * @private
         */
        onClick: function(){
            this.model.trigger('list:select');
            this.$el.toggleClass('collapsed');
        },

        /**
         * Mouse was focused on the item
         * Trigger an event to notify the icon
         * @private
         */
        onMouseEnter: function(){
            this.onFocus();
            this.model.trigger('list:focus');
        },

        /**
         * Mouse was focused out of the item
         * Trigger an event to notify the icon
         * @private
         */
        onMouseLeave: function(){
            this.onBlur();
            this.model.trigger('list:blur');
        },

        /**
         * marker was focused in
         * if the item is out of view, scroll it into view
         * @private
         */
        onFocus: function(){
            this.$el.addClass('active');
            var scrollPane = this.$el.parent();

            var offset = this.$el.offset().top - scrollPane.offset().top;
            var scroll = scrollPane.scrollTop();
            var elementHeight = scrollPane.height();

            var scrollTop;

            if (offset < 0) {
                scrollTop = scroll + offset;
            } else if (offset >= elementHeight) {
                scrollTop = scroll + offset - elementHeight + this.$el.outerHeight();
            }

            scrollPane.scrollTop(scrollTop);
        },

        /**
         * marker was focused out
         * @private
         */
        onBlur: function(){
            this.$el.removeClass('active');
        }
    });
});
