'use strict';

app.controller('TableController', ['$scope', function ($scope) {
  $scope.currentPage = 1;
  $scope.totalItems = 80;

  $scope.pageChanged = function () {

  };
}]);