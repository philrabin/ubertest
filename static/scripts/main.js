require.config({
    paths: {
        'jquery': 'libs/jquery/jquery',
        'underscore': 'libs/underscore-amd/underscore',
        'backbone': 'libs/backbone-amd/backbone',
        'text': 'libs/requirejs-text/text',
        'propertyParser': 'libs/requirejs-plugins/src/propertyParser',
        'async': 'libs/requirejs-plugins/src/async',
        'goog': 'libs/requirejs-plugins/src/goog'
    }
});

require(['app/views/app'], function(AppView) {
    return new AppView();
});
