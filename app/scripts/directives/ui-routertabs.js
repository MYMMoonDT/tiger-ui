angular.module('ui.routertabs', [])
  .controller('uiRoutertabsCtrl', ['$scope', '$state', '$sessionStorage', '$element', function ($scope, $state, $sessionStorage, $element) {
    var TAB_WIDTH = 110, MARGIN_WIDTH = 5;

    var ctrl = this,
      tabs = ctrl.tabs = $scope.tabs = [];

    ctrl.addTab = function (scope, element) {
      scope.$element = element;
      tabs.push(scope);
    };

    /**
     * slider中选择单个tab
     * @param scope
     */
    ctrl.select = function (scope) {
      var routerTab = null;

      for(var i = 0; i < tabs.length; i++) {
        if(tabs[i] == scope) {
          $scope.routerTabs[i].active = true;
          routerTab = $scope.routerTabs[i];
        } else {
          $scope.routerTabs[i].active = false;
        }
      }

      if(!$state.is(routerTab.name)) {
        $state.go(routerTab.name);
      }
    };

    /**
     * slider中关闭单个tab
     * @param scope
     */
    ctrl.close = function (scope) {
      var index = tabs.indexOf(scope);

      $scope.$apply(function () {
        var currentTab = $scope.routerTabs[index],
          previousTab = $scope.routerTabs[index - 1];

        $scope.routerTabs.splice(index, 1);

        resizeSlider();
        removeSliderTab();

        if(currentTab.active) {
          $state.go(previousTab.name);
        }
      });
    };

    /**
     * 从tabs中删除关闭的tab
     * @param scope
     */
    ctrl.remove = function (scope) {
      var index = tabs.indexOf(scope);
      tabs.splice(index, 1);
    };

    /**
     * 初始化routerTabs数组
     */
    if(!$scope.routerTabs) {
      $scope.routerTabs = $sessionStorage.routerTabs || [];
    }

    if($scope.routerTabs.length == 0) {
      var home = {
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

    $scope.currentTabActive = function (routerTab) {
      return $state.includes(routerTab.name);
    };

    $scope.updateTabs = function (event, toState, toParams, fromState, fromParams) {
      if(arguments.length > 1) {
        if(!currentStateExist(toState)) {
          $scope.routerTabs.push({
            label: toState.label,
            name: toState.name
          });
          resizeSlider();
          addSliderTab();
        }
      }

      for(var i = 0; i < $scope.routerTabs.length; i++) {
        $scope.routerTabs[i].active = currentStateActive($scope.routerTabs[i]);
      }

      $sessionStorage.routerTabs = $scope.routerTabs;

      currentSliderTab();
    };

    /**
     * 点击left-angle
     */
    $scope.left = function () {
      var wrapperWidth = $element.find('.routertabs-slider-wrapper').width(),
        sliderWidth = $element.find('.routertabs-slider').width(),
        marginLeft = parseInt($element.find('.routertabs-slider').css('margin-left'));

      if((-marginLeft + wrapperWidth) < sliderWidth) {
        marginLeft = marginLeft - (TAB_WIDTH + MARGIN_WIDTH);
        $element.find('.routertabs-slider').css('margin-left', marginLeft + 'px');
      }
    };

    /**
     * 点击right-angle
     */
    $scope.right = function () {
      var marginLeft = parseInt($element.find('.routertabs-slider').css('margin-left'));

      if(marginLeft < 0) {
        marginLeft = marginLeft + (TAB_WIDTH + MARGIN_WIDTH);
        $element.find('.routertabs-slider').css('margin-left', marginLeft + 'px');
      }
    };

    /**
     * 下拉菜单选择单个routerTab
     * @param routerTab
     */
    $scope.select = function (routerTab) {
      for(var i = 0; i < $scope.routerTabs.length; i++) {
        $scope.routerTabs[i].active = false;
      }
      routerTab.active = true;

      if(!$state.is(routerTab.name)) {
        $state.go(routerTab.name);
      }
    };

    /**
     * 下拉菜单关闭单个的routerTab
     * @param routerTab
     */
    $scope.close = function (routerTab) {
      var index = $scope.routerTabs.indexOf(routerTab),
        currentTab = $scope.routerTabs[index],
        previousTab = $scope.routerTabs[index - 1];

      $scope.routerTabs.splice(index, 1);

      resizeSlider();
      removeSliderTab();

      if(currentTab.active) {
        $state.go(previousTab.name);
      }
    };

    /**
     * 下拉菜单关闭所有routerTab
     */
    $scope.closeAll = function () {
      $scope.routerTabs = $scope.routerTabs.slice(0, 1);
      resizeSlider();
      removeSliderAllTab();

      $state.go($scope.routerTabs[0].name);
    };

    /**
     * 判断state是否已经在routerTabs中
     * @param state
     * @returns {boolean}
     */
    function currentStateExist(state) {
      for(var i = 0; i < $scope.routerTabs.length; i++) {
        if($scope.routerTabs[i].name == state.name) {
          return true;
        }
      }
      return false;
    }

    /**
     * 判断当前state是否是active状态
     * @param state
     * @returns {boolean|*}
     */
    function currentStateActive (state) {
      return $state.includes(state.name);
    }

    /**
     * 调整slider长度
     */
    function resizeSlider() {
      var length = $scope.routerTabs.length,
        width = length * (TAB_WIDTH + MARGIN_WIDTH) - MARGIN_WIDTH;
      $element.find('.routertabs-slider').width(width);
    }

    /**
     * tab添加到slider
     */
    function addSliderTab() {
      var wrapperWidth = $element.find('.routertabs-slider-wrapper').width(),
        sliderWidth = $element.find('.routertabs-slider').width(),
        marginLeft = parseInt($element.find('.routertabs-slider').css('margin-left'));

      if((-marginLeft + wrapperWidth) < sliderWidth) {
        marginLeft = -(sliderWidth - wrapperWidth);
        $element.find('.routertabs-slider').css('margin-left', marginLeft + 'px');
      }
    }

    /**
     * tab从slider移除
     */
    function removeSliderTab() {

    }

    /**
     * 所有tab从slider移除
     */
    function removeSliderAllTab() {
      $element.find('.routertabs-slider').css('margin-left', 0 + 'px');
    }


    /**
     * 根据当前state调整slider
     */
    function currentSliderTab() {
      var index = 0,
        wrapperWidth = $element.find('.routertabs-slider-wrapper').width(),
        marginLeft = parseInt($element.find('.routertabs-slider').css('margin-left'));

      for(index = 0; index < $scope.routerTabs.length; index++) {
        if($state.current.name == $scope.routerTabs[index].name) break;
      }

      if(((index) * MARGIN_WIDTH + (index + 1) * TAB_WIDTH - marginLeft) > wrapperWidth) {
        marginLeft = -Math.abs(wrapperWidth - ((index) * MARGIN_WIDTH + (index + 1) * TAB_WIDTH));
        $element.find('.routertabs-slider').css('margin-left', marginLeft + 'px');
      }

      if((-marginLeft) > index * (MARGIN_WIDTH + TAB_WIDTH)) {
        marginLeft = -(index * (MARGIN_WIDTH + TAB_WIDTH));
        $element.find('.routertabs-slider').css('margin-left', marginLeft + 'px');
      }
    }

    resizeSlider();
    currentSliderTab();
  }])
  .directive('uiRoutertabs', ['$rootScope',
    function($rootScope) {
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          rules: '@'
        },
        controller: 'uiRoutertabsCtrl',
        template: [
          '<div class="ui-routertabs-wrapper">',
            '<a ng-click="left()" class="left-angle"><i class="fa fa-angle-left"></i></a>',
            '<div class="routertabs-slider-wrapper pull-left">',
              '<ul class="pull-left routertabs-slider nav">',
                '<ui-routertab ng-repeat="routerTab in routerTabs" active="routerTab.active">',
                  '<a><span class="text-ellipsis">{{routerTab.label}}</span><i ng-show="$index > 0" class="fa fa-times icon-right"></i></a>',
                '</ui-routertab>',
              '</ul>',
            '</div>',
            '<div class="pull-left clearfix dropdown" dropdown>',
              '<a class="down-angle dropdown-toggle" dropdown-toggle><i class="fa fa-angle-double-down"></i></a>',
              '<ul class="dropdown-menu" dropdown-menu>',
                '<li ng-click="closeAll()"><a><i class="fa fa-times text-danger icon-left"></i>关闭所有标签</a></li>',
                '<li class="divider"><li>',
                '<li ng-click="select(routerTab)" ng-repeat="routerTab in routerTabs">',
                  '<a>',
                    '<i ng-class="{\'fa-check\': currentTabActive(routerTab)}" class="fa text-info icon-left"></i><span class="text-ellipsis">{{routerTab.label}}</span>',
                    '<i ng-show="$index > 0" class="fa fa-times icon-right" ng-click="close(routerTab)"></i>',
                  '</a>',
                '<li>',
              '</ul>',
            '</div>',
            '<a ng-click="right()" class="right-angle"><i class="fa fa-angle-right"></i></a>',
          '</div>'
        ].join(''),
        link: function (scope) {
          var rules = new RegExp(scope.rules);

          var unbindStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', updateTabs);
          var unbindStateChangeError = $rootScope.$on('$stateChangeError', updateTabs);
          var unbindStateChangeCancel = $rootScope.$on('$stateChangeCancel', updateTabs);
          var unbindStateNotFound = $rootScope.$on('$stateNotFound', updateTabs);

          scope.$on('$destroy', unbindStateChangeSuccess);
          scope.$on('$destroy', unbindStateChangeError);
          scope.$on('$destroy', unbindStateChangeCancel);
          scope.$on('$destroy', unbindStateNotFound);

          /**
           * 调用controller中对应的方法,更新routerTabs中相关tab的状态
           * @param event
           * @param toState
           * @param toParams
           * @param fromState
           * @param fromParams
           */
          function updateTabs(event, toState, toParams, fromState, fromParams) {
            if(rules.test(toState.name)) {
              scope.updateTabs(event, toState, toParams, fromState, fromParams);
            }
          }
        }
      };
    }
  ])

  .directive('uiRoutertab', function () {
    return {
      require: '^uiRoutertabs',
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {
        active: '='
      },
      template: '<li ng-click="select()" ng-class="{\'active\': active}" ng-transclude></li>',
      controller: function () {},
      link: function (scope, el, attrs, ctrl) {
        ctrl.addTab(scope, el);

        scope.select = function () {
          ctrl.select(scope);
        };

        el.find('a>i').click(function (event) {
          event.stopPropagation();
          ctrl.close(scope);
        });

        scope.$on('$destroy', function() {
          ctrl.remove(scope);
        });
      }
    }
  });