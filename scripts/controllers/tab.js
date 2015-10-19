'use strict';

app.controller('TabController', ['$scope', function ($scope) {
    $scope.tabs1 = [
        {
            title: '未收的贷款'
        },
        {
            title: '未还的融资'
        }
    ];

    $scope.tabs2 = [
        {
            title: '全部(共4个)'
        },
        {
            title: '期间'
        },
        {
            title: '结清'
        }
    ];
}]);