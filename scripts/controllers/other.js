'use strict';

app.controller('OtherController', ['$scope', function ($scope) {
    $scope.alerts = [
        {
            msg: '还没有发送的定时短信都会出现在这里'
        }
    ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.val = 0;
}]);