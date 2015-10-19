'use strict';

app.controller('FormController', ['$scope', 'ngDialog', function ($scope, ngDialog) {
    $scope.gender = {};

    $scope.gender.selected = undefined;

    $scope.genderList = [
        {
            value: 'male',
            name: '先生'
        },
        {
            value: 'female',
            name: '女士'
        }
    ];

    $scope.birthday = new Date();

    //-----------------------------------------------------
    $scope.isSelectMsgTime = true;

    $scope.selectCustomer = function () {
        ngDialog.open({
            template: 'tpl/modal/tiger-select-customer.html',
            className: 'tiger-dialog'
        });
    };

    $scope.selectMsgTpl = function () {
        ngDialog.open({
            template: 'tpl/modal/tiger-select-message-tpl.html',
            className: 'tiger-dialog'
        });
    };

    $scope.selectMsgTime = function () {
        if($scope.isSelectMsgTime) {
            ngDialog.open({
                template: 'tpl/modal/tiger-select-message-time.html',
                className: 'tiger-dialog'
            });
        }
    };
}]);