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
                },
                {
                    name: 'tigerDatePicker',
                    files: [
                        '../scripts/directives/tiger-datepicker/tiger-datepicker.js'
                    ]
                },
                {
                    name: 'ui.select',
                    files: [
                        '../bower_components/ui-select/dist/select.min.js',
                        '../bower_components/ui-select/dist/select.min.css'
                    ]
                },
                {
                    name: 'ngDialog',
                    files: [
                        '../bower_components/ng-dialog/js/ngDialog.js',
                        '../bower_components/ng-dialog/css/ngDialog.css'
                    ]
                }
            ]
        });
    }]);
