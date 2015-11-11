'use strict';

app.controller('TabItemController', ['$scope', '$stateParams', function ($scope, $stateParams) {
  $scope.id = $stateParams.id;
}]);
