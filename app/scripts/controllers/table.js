'use strict';

app.controller('TableController', ['$scope', function ($scope) {
  $scope.currentPage = 1;
  $scope.totalItems = 80;

  $scope.pageChanged = function () {

  };

  $scope.checked = false; // This will be binded using the ps-open attribute
               $scope.toggle = function(){
                   $scope.checked = !$scope.checked
               }
}]);
