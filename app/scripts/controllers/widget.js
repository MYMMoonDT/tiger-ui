'use strict';

app.controller('WidgetController', ['$scope', function ($scope) {
  $scope.showPageSlide = false;

  $scope.togglePageSlide = function () {
    $scope.showPageSlide = !$scope.showPageSlide;
  };
}]);
