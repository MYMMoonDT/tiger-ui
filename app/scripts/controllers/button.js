'use strict';

app.controller('ButtonController', ['$scope', 'uiRoutertabService', function ($scope, uiRoutertabService) {
  $scope.leavePage = function () {
    uiRoutertabService.leaveCurrentPage();
  };
}]);