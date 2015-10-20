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
          templateUrl: 'tpl/app.html'
        })
        .state('app.home', {
          label: '控制台',
          url: '/home',
          templateUrl: 'tpl/home.html'
        })
        .state('app.button', {
          label: 'Button',
          url: '/button',
          templateUrl: 'tpl/button.html'
        })
        .state('app.widget', {
          label: 'Widget',
          url: '/widget',
          templateUrl: 'tpl/widget.html'
        })
        .state('app.tab', {
          label: 'Tab',
          url: '/tab',
          templateUrl: 'tpl/tab.html'
        })
        .state('app.table', {
          label: 'Table',
          url: '/table',
          templateUrl: 'tpl/table.html',
          controller: 'TableController',
          resolve: {
            controller: ['$ocLazyLoad', function($ocLazyLoad) {
              return $ocLazyLoad.load([
                'scripts/controllers/table.js',
              ]);
            }]
          }
        })
        .state('app.form', {
          label: 'Form',
          url: '/form',
          templateUrl: 'tpl/form.html'
        });
    }
  ]);