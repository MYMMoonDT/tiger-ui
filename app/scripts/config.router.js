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
          controller: 'AppController'
        })
        .state('app.home', {
          label: '控制台',
          url: '/home',
          sticky: true,
          deepStateRedirect: true,
          views: {
            'home': {
              templateUrl: 'tpl/home.html'
            }
          }
        })
        .state('app.button', {
          label: 'Button',
          url: '/button',
          sticky: true,
          deepStateRedirect: true,
          views: {
            'button': {
              templateUrl: 'tpl/button.html',
              controller: 'ButtonController',
              resolve: {
                controller: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load([
                    'scripts/controllers/button.js'
                  ]);
                }]
              }
            }
          }
        })
        .state('app.widget', {
          label: 'Widget',
          url: '/widget',
          sticky: true,
          deepStateRedirect: true,
          views: {
            'widget': {
              templateUrl: 'tpl/widget.html',
              controller: 'WidgetController',
              resolve: {
                controller: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load([
                    'scripts/controllers/widget.js'
                  ]);
                }]
              }
            }
          }
        })
        .state('app.tab', {
          label: 'Tab',
          url: '/tab',
          sticky: true,
          deepStateRedirect: true,
          views: {
            'tab': {
              templateUrl: 'tpl/tab.html'
            }
          }
        })
        .state('app.tabItem', {
          label: 'TabItem',
          url: '/tab/:id',
          sticky: true,
          deepStateRedirect: true,
          views: {
            'tabItem': {
              templateUrl: 'tpl/tab-item.html',
              controller: 'TabItemController',
              resolve: {
                controller: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load([
                    'scripts/controllers/tab-item.js'
                  ]);
                }]
              }
            }
          }
        })
        .state('app.table', {
          label: 'Table',
          url: '/table',
          sticky: true,
          deepStateRedirect: true,
          views: {
            'table': {
              templateUrl: 'tpl/table.html',
              controller: 'TableController',
              resolve: {
                controller: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load([
                    'scripts/controllers/table.js'
                  ]);
                }]
              }
            }
          }
        })
        .state('app.form', {
          label: 'Form',
          url: '/form',
          sticky: true,
          deepStateRedirect: true,
          views: {
            'form': {
              templateUrl: 'tpl/form.html'
            }
          }
        });
    }
  ]);