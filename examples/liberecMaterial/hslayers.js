'use strict';

var hsl_path = '../../';
var gitsha = $.ajax({
    type: "GET",
    url: hsl_path + 'gitsha.js',
    async: false
}).responseText;

require.config({
    urlArgs: 'bust=' + gitsha,
    paths: {
        app: 'app',
        core: hsl_path + 'components/core/core',
        angular: hsl_path + 'bower_components/angular/angular',
        ngAnimate: hsl_path + 'node_modules/angular-animate/angular-animate',
        ngAria: hsl_path + 'node_modules/angular-aria/angular-aria',
        ngMaterial: hsl_path + 'node_modules/angular-material/angular-material',
        matCore: hsl_path + 'examples/liberecMaterial/materialComponents/matCore'
    },
    shim: {
        'ngAnimate': ['angular'],
        'ngAria': ['angular'],
        'ngMaterial': {
             deps: ['ngAnimate', 'ngAria']
        }
    }
});

window.name = "NG_DEFER_BOOTSTRAP!";

require(['core','matCore'], function(app) {
    require(['app'], function(app) {
        var $html = angular.element(document.getElementsByTagName('html')[0]);
        angular.element().ready(function() {
            angular.resumeBootstrap([app['name']]);
        });
    });
});