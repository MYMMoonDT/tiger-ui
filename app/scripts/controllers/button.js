'use strict';

app.controller('ButtonController', ['$scope', 'uiRoutertabService','$popover', function ($scope, uiRoutertabService
,$popover) {
  $scope.leavePage = function () {
    uiRoutertabService.leaveCurrentPage();
  };
  var myPopover = $popover(angular.element(document.querySelector('#edit')), {title: 'My Title', content: 'My Content', trigger: 'click'});
  myPopover.$promise.then(myPopover.toggle);
  

  $scope.open = true;
  $scope.templateUrl = "tpl/blocks/popover.html";
}]);
