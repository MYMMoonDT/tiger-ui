'use strict';

angular.module('tigerUI')
    .controller('TigerAppCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.home = {
            label: '控制台',
            name: 'app.home'
        };
    }]);
