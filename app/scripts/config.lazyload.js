'use strict';

angular.module('tigerUI')
    .constant('JQ_CONFIG', {
        slimScroll: ['../bower_components/slimscroll/jquery.slimscroll.min.js']
    })
    // oclazyload config
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            modules: [
                {
                    name: 'tigerRouterTabs',
                    files: [
                        '../scripts/directives/tiger-router-tabs/tiger-router-tabs.js',
                        '../scripts/directives/tiger-router-tabs/tiger-router-tabs.css'
                    ]
                }
            ]
        });
    }]);
