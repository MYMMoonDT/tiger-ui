'use strict';

angular.module('tigerUI', [])
    .controller('tigerDatepickerCtrl', ['$scope', 'uibDatepickerPopupConfig', function ($scope, uibDatepickerPopupConfig) {
        $scope.status = {
            opened: false
        };

        $scope.dateOptions = {
            showWeeks: false,
            class: 'tiger-datepicker'
        };
        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        uibDatepickerPopupConfig.currentText = '今天';
        uibDatepickerPopupConfig.clearText = '清除';
        uibDatepickerPopupConfig.closeText = '关闭';
    }])
    .directive('tigerDatepicker', function () {
        return {
            restrict: 'EA',
            replace: true,
            require: ['tigerDatepicker', '^ngModel'],
            scope: {},
            controller: 'tigerDatepickerCtrl',
            templateUrl: 'scripts/directives/tiger-datepicker/tiger-datepicker.html',
            link: function (scope, el, attrs, ctrls) {
                var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                ngModelCtrl.$render = function () {
                    scope.date = ngModelCtrl.$viewValue;
                };

                scope.$watch('date', function () {
                    ngModelCtrl.$setViewValue(scope.date);
                });
            }
        };
    });