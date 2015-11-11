'use strict';

app.controller('AppController', ['$scope', 'uiRoutertabService', function ($scope, uiRoutertabService) {
  $scope.clearPage = function () {
    uiRoutertabService.clearAllPage();
  };
}]);
