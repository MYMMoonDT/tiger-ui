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
angular.module('tigerUI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('scripts/directives/tiger-datepicker/tiger-datepicker.html',
    "<p class=\"input-group tiger-datepicker-wrapper\">\r" +
    "\n" +
    "    <input type=\"text\" class=\"form-control\"\r" +
    "\n" +
    "           readonly=\"readonly\"\r" +
    "\n" +
    "           ng-model=\"date\"\r" +
    "\n" +
    "           is-open=\"status.opened\"\r" +
    "\n" +
    "           uib-datepicker-popup\r" +
    "\n" +
    "           datepicker-options=\"dateOptions\"/>\r" +
    "\n" +
    "    <span class=\"input-group-btn\">\r" +
    "\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\r" +
    "\n" +
    "    </span>\r" +
    "\n" +
    "</p>"
  );

}]);
