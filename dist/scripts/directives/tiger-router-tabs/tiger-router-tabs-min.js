'use strict';

angular.module('tigerUI', [])
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
angular.module('tigerUI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('dist/scripts/directives/tiger-router-tabs/tiger-router-tab.html',
    "<li ng-transclude class=\"tiger-router-tab\" ng-click=\"select()\" ng-class=\"{'active': active, 'first': first(), 'last': last()}\">\r" +
    "\n" +
    "</li>"
  );


  $templateCache.put('dist/scripts/directives/tiger-router-tabs/tiger-router-tabs.html',
    "<div class=\"tiger-router-tabs-wrapper\">\r" +
    "\n" +
    "    <a class=\"left-angle\" href=\"javascript:void(0);\"><i class=\"fa fa-angle-left\"></i></a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"tiger-router-tabs-slider\">\r" +
    "\n" +
    "        <ul class=\"nav tiger-router-tabs\">\r" +
    "\n" +
    "            <tiger-router-tab ng-repeat=\"routerTab in routerTabs\" active=\"routerTab.active\">\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\"><span>{{routerTab.label}}</span><i ng-show=\"$index > 0\" class=\"icon icon-close\"></i></a>\r" +
    "\n" +
    "            </tiger-router-tab>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"down-angle-wrapper dropdown\" uib-dropdown>\r" +
    "\n" +
    "        <a class=\"down-angle dropdown-toggle\" href=\"javascript:void(0);\" uib-dropdown-toggle><i class=\"fa fa-angle-double-down\"></i></a>\r" +
    "\n" +
    "        <ul class=\"dropdown-menu\" uib-dropdown-menu>\r" +
    "\n" +
    "            <li ng-click=\"closeAll()\">\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\"><i class=\"icon icon-close-red\"></i>关闭所有标签</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "            <li class=\"divider\"></li>\r" +
    "\n" +
    "            <li ng-repeat=\"routerTab in routerTabs\" ng-click=\"select(routerTab)\">\r" +
    "\n" +
    "                <a href=\"javascript:void(0);\">\r" +
    "\n" +
    "                    <i class=\"icon icon-empty\" ng-class=\"{'icon-check-blue': currentStateEqualTo(routerTab)}\"></i>\r" +
    "\n" +
    "                    {{routerTab.label}}\r" +
    "\n" +
    "                    <i ng-show=\"$index > 0\" class=\"icon icon-close\" ng-click=\"close(routerTab)\"></i>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <a class=\"right-angle\" href=\"javascript:void(0);\"><i class=\"fa fa-angle-right\"></i></a>\r" +
    "\n" +
    "</div>"
  );

}]);
