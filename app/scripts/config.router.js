'use strict';

angular.module('tigerUI')
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }])
    .config(
    ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                .otherwise('/app/home');
            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: 'tpl/app.html',
                    resolve: {
                        routerTabs: ['$ocLazyLoad',
                            function( $ocLazyLoad ){
                                return $ocLazyLoad.load('tigerRouterTabs');
                            }]
                    }
                })
                .state('app.home', {
                    label: '控制台',
                    url: '/home',
                    templateUrl: 'tpl/home.html'
                })
                .state('app.button', {
                    label: '按钮',
                    url: '/button',
                    templateUrl: 'tpl/button.html'
                })
                .state('app.link', {
                    label: '链接',
                    url: '/link',
                    templateUrl: 'tpl/link.html'
                })
                .state('app.tab', {
                    label: '标签',
                    url: '/tab',
                    templateUrl: 'tpl/tab.html',
                    resolve: {
                        deps: ['routerTabs', '$ocLazyLoad',
                            function( routerTabs, $ocLazyLoad ){
                                return $ocLazyLoad.load('scripts/controllers/tab.js');
                            }]
                    }
                })
                .state('app.form', {
                    label: '表单',
                    url: '/form',
                    templateUrl: 'tpl/form.html',
                    resolve: {
                        deps: ['routerTabs', '$ocLazyLoad',
                            function( routerTabs, $ocLazyLoad ){
                                return $ocLazyLoad.load([
                                    'ui.select',
                                    'tigerDatePicker',
                                    'ngDialog',
                                    'scripts/controllers/form.js'
                                ]);
                            }]
                    }
                })
                .state('app.list', {
                    label: '列表',
                    url: '/list',
                    templateUrl: 'tpl/list.html'
                })
                .state('app.other', {
                    label: '其他',
                    url: '/other',
                    templateUrl: 'tpl/other.html',
                    resolve: {
                        deps: ['routerTabs', '$ocLazyLoad',
                            function( routerTabs, $ocLazyLoad ){
                                return $ocLazyLoad.load('scripts/controllers/other.js');
                            }]
                    }
                });
        }
    ]);
