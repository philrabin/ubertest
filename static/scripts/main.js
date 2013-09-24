require.config({
    hbs : {
        templateExtension: 'hbs',
        disableI18n: true
    },
    paths: {
        'jquery': 'libs/jquery/jquery',
        'underscore': 'libs/underscore-amd/underscore',
        'handlebars': 'libs/require-handlebars-plugin/Handlebars',
        'hbs': 'libs/require-handlebars-plugin/hbs',
        'json2': 'libs/require-handlebars-plugin/hbs/json2',
        'i18nprecompile': 'libs/require-handlebars-plugin/hbs/i18nprecompile',
        'backbone': 'libs/backbone-amd/backbone',
        'text': 'libs/requirejs-text/text',
        'propertyParser': 'libs/requirejs-plugins/src/propertyParser',
        'async': 'libs/requirejs-plugins/src/async',
        'goog': 'libs/requirejs-plugins/src/goog'
    }
});

require(['app/views/App'], function(AppView) {
    return new AppView();
});
