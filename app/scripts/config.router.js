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
                        deps: ['$ocLazyLoad',
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
                .state('app.form', {
                    label: '表单',
                    url: '/form',
                    templateUrl: 'tpl/form.html'
                })
                .state('app.list', {
                    label: '列表',
                    url: '/list',
                    templateUrl: 'tpl/list.html'
                })
                .state('app.other', {
                    label: '其他',
                    url: '/other',
                    templateUrl: 'tpl/other.html'
                })

                .state('app.test1', {
                    label: '测试1',
                    url: '/test1',
                    templateUrl: 'tpl/test1.html'
                })
                .state('app.test2', {
                    label: '测试2',
                    url: '/test2',
                    templateUrl: 'tpl/test2.html'
                })
                .state('app.test3', {
                    label: '测试3',
                    url: '/test3',
                    templateUrl: 'tpl/test3.html'
                })
                .state('app.test4', {
                    label: '测试4',
                    url: '/test4',
                    templateUrl: 'tpl/test4.html'
                })
                .state('app.test5', {
                    label: '测试5',
                    url: '/test5',
                    templateUrl: 'tpl/test5.html'
                })
                .state('app.test6', {
                    label: '测试6',
                    url: '/test6',
                    templateUrl: 'tpl/test6.html'
                })
                .state('app.test7', {
                    label: '测试7',
                    url: '/test7',
                    templateUrl: 'tpl/test7.html'
                })
        }
    ]);
