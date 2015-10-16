angular.module("ui.tiger", ["ui.tiger.tpl", "ui.tiger.datepicker", "ui.tiger.routerTabs"]);
angular.module('ui.tiger.tpl', ['scripts/directives/tiger-router-tabs/tiger-router-tab.html', 'scripts/directives/tiger-router-tabs/tiger-router-tabs.html', 'scripts/directives/tiger-datepicker/tiger-datepicker.html']);

angular.module("scripts/directives/tiger-router-tabs/tiger-router-tab.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scripts/directives/tiger-router-tabs/tiger-router-tab.html",
    "<li ng-transclude class=\"tiger-router-tab\" ng-click=\"select()\" ng-class=\"{'active': active, 'first': first(), 'last': last()}\">\n" +
    "</li>");
}]);

angular.module("scripts/directives/tiger-router-tabs/tiger-router-tabs.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scripts/directives/tiger-router-tabs/tiger-router-tabs.html",
    "<div class=\"tiger-router-tabs-wrapper\">\n" +
    "    <a class=\"left-angle\" href=\"javascript:void(0);\"><i class=\"fa fa-angle-left\"></i></a>\n" +
    "\n" +
    "    <div class=\"tiger-router-tabs-slider\">\n" +
    "        <ul class=\"nav tiger-router-tabs\">\n" +
    "            <tiger-router-tab ng-repeat=\"routerTab in routerTabs\" active=\"routerTab.active\">\n" +
    "                <a href=\"javascript:void(0);\"><span>{{routerTab.label}}</span><i ng-show=\"$index > 0\" class=\"icon icon-close\"></i></a>\n" +
    "            </tiger-router-tab>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"down-angle-wrapper dropdown\" uib-dropdown>\n" +
    "        <a class=\"down-angle dropdown-toggle\" href=\"javascript:void(0);\" uib-dropdown-toggle><i class=\"fa fa-angle-double-down\"></i></a>\n" +
    "        <ul class=\"dropdown-menu\" uib-dropdown-menu>\n" +
    "            <li ng-click=\"closeAll()\">\n" +
    "                <a href=\"javascript:void(0);\"><i class=\"icon icon-close-red\"></i>关闭所有标签</a>\n" +
    "            </li>\n" +
    "            <li class=\"divider\"></li>\n" +
    "            <li ng-repeat=\"routerTab in routerTabs\" ng-click=\"select(routerTab)\">\n" +
    "                <a href=\"javascript:void(0);\">\n" +
    "                    <i class=\"icon icon-empty\" ng-class=\"{'icon-check-blue': currentStateEqualTo(routerTab)}\"></i>\n" +
    "                    {{routerTab.label}}\n" +
    "                    <i ng-show=\"$index > 0\" class=\"icon icon-close\" ng-click=\"close(routerTab)\"></i>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <a class=\"right-angle\" href=\"javascript:void(0);\"><i class=\"fa fa-angle-right\"></i></a>\n" +
    "</div>");
}]);

angular.module("scripts/directives/tiger-datepicker/tiger-datepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scripts/directives/tiger-datepicker/tiger-datepicker.html",
    "<p class=\"input-group tiger-datepicker-wrapper\">\n" +
    "    <input type=\"text\" class=\"form-control\"\n" +
    "           readonly=\"readonly\"\n" +
    "           ng-model=\"date\"\n" +
    "           is-open=\"status.opened\"\n" +
    "           uib-datepicker-popup\n" +
    "           datepicker-options=\"dateOptions\"/>\n" +
    "    <span class=\"input-group-btn\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "    </span>\n" +
    "</p>");
}]);

angular.module('ui.tiger.routerTabs', [])
    .controller('tigerRouterTabsCtrl', ['$scope', '$sessionStorage', '$rootScope', '$state', '$timeout', '$element', function ($scope, $sessionStorage, $rootScope, $state, $timeout, $element) {
        function currentStateExist(state) {
            for(var i = 0; i < $scope.routerTabs.length; i++) {
                if($scope.routerTabs[i].name == state.name) {
                    return true;
                }
            }
            return false;
        }

        var currentStateEqualTo = $scope.currentStateEqualTo = function (state) {
            return $state.is(state.name);
        };

        function currentStateActive (state) {
            return $state.includes(state.name);
        }

        function resizeSlider() {

        }

        var ctrl = this,
            tabs = ctrl.tabs = $scope.tabs = [];

        ctrl.first = function (tab) {
            return tabs[0] == tab;
        };

        ctrl.last = function (tab) {
            return tabs[tabs.length - 1] == tab;
        };

        ctrl.select = function (selectedTab) {
            var routerTab = null;

            for(var i = 0; i < tabs.length; i++) {
                if(tabs[i] == selectedTab) {
                    $scope.routerTabs[i].active = true;
                    routerTab = $scope.routerTabs[i];
                } else {
                    $scope.routerTabs[i].active = false;
                }
            }

            if(!currentStateEqualTo(routerTab)) {
                $state.go(routerTab.name);
            }
        };

        ctrl.addTab = function (tab, element) {
            tab.$element = element;
            tabs.push(tab);

            resizeSlider();
        };

        ctrl.close = function (tab) {
            var index = tabs.indexOf(tab);

            $scope.$apply(function () {
                if($scope.routerTabs[index].active) {
                    $state.go($scope.routerTabs[index - 1].name);
                }

                $scope.routerTabs.splice(index, 1);
            });
        };

        ctrl.removeTab = function (tab) {
            var index = tabs.indexOf(tab);
            tabs.splice(index, 1);

            resizeSlider();
        };

        if(!$scope.routerTabs) {
            $scope.routerTabs = $sessionStorage.routerTabs || [];
        }

        if($scope.routerTabs.length == 0) {
            var home = $rootScope.home ||
                {
                    label: '控制台',
                    name: 'app.home'
                };
            $scope.routerTabs.push(home);

            if($state.current.name != home.name) {
                $scope.routerTabs.push({
                    label: $state.current.label,
                    name: $state.current.name
                });
            }
        }

        $scope.updateTabs = function (event, toState, toParams, fromState, fromParams) {
            if(arguments.length > 1) {
                if(!currentStateExist(toState)) {
                    $scope.routerTabs.push({
                        label: toState.label,
                        name: toState.name
                    });
                }
            }

            for(var i = 0; i < $scope.routerTabs.length; i++) {
                $scope.routerTabs[i].active = currentStateActive($scope.routerTabs[i]);
            }

            $sessionStorage.routerTabs = $scope.routerTabs;
        };

        $scope.select = function (routerTab) {
            for(var i = 0; i < $scope.routerTabs.length; i++) {
                $scope.routerTabs[i].active = false;
            }
            routerTab.active = true;

            if(!currentStateEqualTo(routerTab)) {
                $state.go(routerTab.name);
            }
        };

        $scope.close = function (routerTab) {
            var index = $scope.routerTabs.indexOf(routerTab);

            if($scope.routerTabs[index].active) {
                $state.go($scope.routerTabs[index - 1].name);
            }

            $scope.routerTabs.splice(index, 1);
        };

        $scope.closeAll = function () {
            $scope.routerTabs = $scope.routerTabs.slice(0, 1);
            $state.go($scope.routerTabs[0].name);
        };

        $scope.updateTabs();
    }])
    .directive('tigerRouterTabs',
        ['$rootScope', '$state', '$timeout', '$sessionStorage', '$window',
            function ($rootScope, $state, $timeout, $sessionStorage, $window) {
                var MIN_WINDOW_WIDTH = 1024,
                    ASIDE_WIDTH = 175;

                return {
                    restrict: 'EA',
                    replace: true,
                    scope: {
                        rules: '@'
                    },
                    controller: 'tigerRouterTabsCtrl',
                    templateUrl: 'scripts/directives/tiger-router-tabs/tiger-router-tabs.html',
                    link: function (scope, element) {
                        var rules = new RegExp(scope.rules);

                        var unbindStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', updateTabs);
                        var unbindStateChangeError = $rootScope.$on('$stateChangeError', updateTabs);
                        var unbindStateChangeCancel = $rootScope.$on('$stateChangeCancel', updateTabs);
                        var unbindStateNotFound = $rootScope.$on('$stateNotFound', updateTabs);

                        scope.$on('$destroy', unbindStateChangeSuccess);
                        scope.$on('$destroy', unbindStateChangeError);
                        scope.$on('$destroy', unbindStateChangeCancel);
                        scope.$on('$destroy', unbindStateNotFound);

                        function updateTabs(event, toState, toParams, fromState, fromParams) {
                            if(rules.test(toState.name)) {
                                scope.updateTabs(event, toState, toParams, fromState, fromParams);
                            }
                        }

                        scope.resizeWrapper = function () {
                            var winWidth = angular.element($window).width(),
                                wrapperMinWidth = MIN_WINDOW_WIDTH - ASIDE_WIDTH,
                                wrapperWidth = winWidth - ASIDE_WIDTH;

                            element.width((wrapperWidth > wrapperMinWidth ? wrapperWidth : wrapperMinWidth));
                        };

                        angular.element($window).bind('resize', function () {
                            scope.resizeWrapper();
                        });

                        scope.resizeWrapper();
                    }
                };
            }
        ]
    )
    .directive('tigerRouterTab', ['$timeout', function ($timeout) {
        return {
            require: '^tigerRouterTabs',
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                active: '=?'
            },
            templateUrl: 'scripts/directives/tiger-router-tabs/tiger-router-tab.html',
            controller: function () {

            },
            link: function (scope, el, attrs, ctrl) {
                ctrl.addTab(scope, el);

                scope.select = function () {
                    ctrl.select(scope);
                };

                scope.first = function () {
                    return ctrl.first(scope);
                };

                scope.last = function () {
                    return ctrl.last(scope);
                };

                el.find('.icon-close').click(function (event) {
                    event.stopPropagation();
                    ctrl.close(scope);
                });

                scope.$on('$destroy', function() {
                    ctrl.removeTab(scope);
                });
            }
        };
    }]);
angular.module('ui.tiger.datepicker', [])
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