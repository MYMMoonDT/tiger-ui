'use strict';

app.controller('ListController', ['$scope', function ($scope) {
    $scope.currentPage = 1;
    $scope.totalItems = 800;

    $scope.pageChanged = function () {

    };
}]);