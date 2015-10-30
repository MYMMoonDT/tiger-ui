'use strict';

/**
 * 0.1.1
 * Deferred load js/css file, used for ui-jq.js and Lazy Loading.
 *
 * @ flatfull.com All Rights Reserved.
 * Author url: http://themeforest.net/user/flatfull
 */

angular.module('ui.load', [])
  .service('uiLoad', ['$document', '$q', '$timeout', function ($document, $q, $timeout) {

    var loaded = [];
    var promise = false;
    var deferred = $q.defer();

    /**
     * Chain loads the given sources
     * @param srcs array, script or css
     * @returns {*} Promise that will be resolved once the sources has been loaded.
     */
    this.load = function (srcs) {
      srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
      var self = this;
      if(!promise){
        promise = deferred.promise;
      }
      angular.forEach(srcs, function(src) {
        promise = promise.then( function(){
          return src.indexOf('.css') >=0 ? self.loadCSS(src) : self.loadScript(src);
        } );
      });
      deferred.resolve();
      return promise;
    }

    /**
     * Dynamically loads the given script
     * @param src The url of the script to load dynamically
     * @returns {*} Promise that will be resolved once the script has been loaded.
     */
    this.loadScript = function (src) {
      if(loaded[src]) return loaded[src].promise;

      var deferred = $q.defer();
      var script = $document[0].createElement('script');
      script.src = src;
      script.onload = function (e) {
        $timeout(function () {
          deferred.resolve(e);
        });
      };
      script.onerror = function (e) {
        $timeout(function () {
          deferred.reject(e);
        });
      };
      $document[0].body.appendChild(script);
      loaded[src] = deferred;

      return deferred.promise;
    };

    /**
     * Dynamically loads the given CSS file
     * @param href The url of the CSS to load dynamically
     * @returns {*} Promise that will be resolved once the CSS file has been loaded.
     */
    this.loadCSS = function (href) {
      if(loaded[href]) return loaded[href].promise;

      var deferred = $q.defer();
      var style = $document[0].createElement('link');
      style.rel = 'stylesheet';
      style.type = 'text/css';
      style.href = href;
      style.onload = function (e) {
        $timeout(function () {
          deferred.resolve(e);
        });
      };
      style.onerror = function (e) {
        $timeout(function () {
          deferred.reject(e);
        });
      };
      $document[0].head.appendChild(style);
      loaded[href] = deferred;

      return deferred.promise;
    };
  }]);

angular.module('ui.butterbar', [])
  .directive('uiButterbar', ['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
    return {
      restrict: 'AC',
      template:'<span class="bar"></span>',
      link: function(scope, el, attrs) {
        el.addClass('butterbar hide');
        scope.$on('$stateChangeStart', function(event) {
          $anchorScroll();
          el.removeClass('hide').addClass('active');
        });
        scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState ) {
          event.targetScope.$watch('$viewContentLoaded', function(){
            el.addClass('hide').removeClass('active');
          })
        });
      }
    };
  }]);

'use strict';

/**
 * 0.1.1
 * General-purpose jQuery wrapper. Simply pass the plugin name as the expression.
 *
 * It is possible to specify a default set of parameters for each jQuery plugin.
 * Under the jq key, namespace each plugin by that which will be passed to ui-jq.
 * Unfortunately, at this time you can only pre-define the first parameter.
 * @example { jq : { datepicker : { showOn:'click' } } }
 *
 * @param ui-jq {string} The $elm.[pluginName]() to call.
 * @param [ui-options] {mixed} Expression to be evaluated and passed as options to the function
 *     Multiple parameters can be separated by commas
 * @param [ui-refresh] {expression} Watch expression and refire plugin on changes
 *
 * @example <input ui-jq="datepicker" ui-options="{showOn:'click'},secondParameter,thirdParameter" ui-refresh="iChange">
 */
angular.module('ui.jq', ['ui.load']).
  value('uiJqConfig', {}).
  directive('uiJq', ['uiJqConfig', 'JQ_CONFIG', 'uiLoad', '$timeout', function uiJqInjectingFunction(uiJqConfig, JQ_CONFIG, uiLoad, $timeout) {

    return {
      restrict: 'A',
      compile: function uiJqCompilingFunction(tElm, tAttrs) {

        if (!angular.isFunction(tElm[tAttrs.uiJq]) && !JQ_CONFIG[tAttrs.uiJq]) {
          throw new Error('ui-jq: The "' + tAttrs.uiJq + '" function does not exist');
        }
        var options = uiJqConfig && uiJqConfig[tAttrs.uiJq];

        return function uiJqLinkingFunction(scope, elm, attrs) {

          function getOptions() {
            var linkOptions = [];

            // If ui-options are passed, merge (or override) them onto global defaults and pass to the jQuery method
            if (attrs.uiOptions) {
              linkOptions = scope.$eval('[' + attrs.uiOptions + ']');
              if (angular.isObject(options) && angular.isObject(linkOptions[0])) {
                linkOptions[0] = angular.extend({}, options, linkOptions[0]);
              }
            } else if (options) {
              linkOptions = [options];
            }
            return linkOptions;
          }

          // If change compatibility is enabled, the form input's "change" event will trigger an "input" event
          if (attrs.ngModel && elm.is('select,input,textarea')) {
            elm.bind('change', function () {
              elm.trigger('input');
            });
          }

          // Call jQuery method and pass relevant options
          function callPlugin() {
            $timeout(function () {
              elm[attrs.uiJq].apply(elm, getOptions());
            }, 0, false);
          }

          function refresh() {
            // If ui-refresh is used, re-fire the the method upon every change
            if (attrs.uiRefresh) {
              scope.$watch(attrs.uiRefresh, function () {
                callPlugin();
              });
            }
          }

          if (JQ_CONFIG[attrs.uiJq]) {
            uiLoad.load(JQ_CONFIG[attrs.uiJq]).then(function () {
              callPlugin();
              refresh();
            }).catch(function () {

            });
          } else {
            callPlugin();
            refresh();
          }
        };
      }
    };
  }]);

angular.module('ui.nav', [])
  .directive('uiNav', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        var _window = $(window),
          _mb = 768,
          wrap = $('.app-aside'),
          next,
          backdrop = '.dropdown-backdrop';
        // unfolded
        el.on('click', 'a', function(e) {
          next && next.trigger('mouseleave.nav');
          var _this = $(this);
          _this.parent().siblings( ".active" ).toggleClass('active');
          _this.next().is('ul') &&  _this.parent().toggleClass('active') &&  e.preventDefault();
          // mobile
          _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.app-aside').removeClass('show off-screen') );
        });

        // folded & fixed
        el.on('mouseenter', 'a', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
          if ( !$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb ) || $('.app-aside-dock').length) return;
          var _this = $(e.target)
            , top
            , w_h = $(window).height()
            , offset = 50
            , min = 150;

          !_this.is('a') && (_this = _this.closest('a'));
          if( _this.next().is('ul') ){
            next = _this.next();
          }else{
            return;
          }

          _this.parent().addClass('active');
          top = _this.parent().position().top + offset;
          next.css('top', top);
          if( top + next.height() > w_h ){
            next.css('bottom', 0);
          }
          if(top + min > w_h){
            next.css('bottom', w_h - top - offset).css('top', 'auto');
          }
          next.appendTo(wrap);

          next.on('mouseleave.nav', function(e){
            $(backdrop).remove();
            next.appendTo(_this.parent());
            next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
            _this.parent().removeClass('active');
          });

          $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next){
            next && next.trigger('mouseleave.nav');
          });

        });

        wrap.on('mouseleave', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
        });
      }
    };
  }]);

angular.module('ui.routertabs', [])
  .controller('uiRoutertabsCtrl', ['$scope', '$state', '$sessionStorage', '$element', '$rootScope', function ($scope, $state, $sessionStorage, $element, $rootScope) {
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
        $state.go(routerTab.name, routerTab.params);
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

        if(currentTab.active) {
          $state.go(previousTab.name, previousTab.params);
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
      $rootScope.routerTabs = $scope.routerTabs = $sessionStorage.routerTabs || [];
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
          name: $state.current.name,
          params: null
        });
      }
    }

    $scope.$watchCollection('routerTabs', function () {
      resizeSlider();
    });

    $scope.currentTabActive = function (routerTab) {
      return $state.includes(routerTab.name);
    };

    $scope.updateTabs = function (event, toState, toParams, fromState, fromParams) {
      if(arguments.length > 1) {
        if(!currentStateExist(toState)) {
          $scope.routerTabs.push({
            label: toState.label,
            params: toParams,
            name: toState.name
          });
        }else{
          for(var i = 0; i < $scope.routerTabs.length; i++) {
            if(toState.name == $scope.routerTabs[i].name) {
              $scope.routerTabs[i].params = toParams;
            }
          }
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
        $state.go(routerTab.name, routerTab.params);
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

      if(currentTab.active) {
        $state.go(previousTab.name, previousTab.params);
      }
    };

    /**
     * 下拉菜单关闭所有routerTab
     */
    $scope.closeAll = function () {
      $rootScope.routerTabs = $scope.routerTabs = $scope.routerTabs.slice(0, 1);

      $state.go($scope.routerTabs[0].name, $scope.routerTabs[0].params);
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
        sliderWidth = length * (TAB_WIDTH + MARGIN_WIDTH) - MARGIN_WIDTH;
      $element.find('.routertabs-slider').width(sliderWidth);

      return sliderWidth;
    }

    /**
     * 根据当前state调整slider
     */
    function currentSliderTab() {
      var index = 0, indexWidth = 0,
        wrapperWidth = parseInt($element.find('.routertabs-slider-wrapper').css('max-width')),
        sliderWidth = resizeSlider(),
        marginLeft = parseInt($element.find('.routertabs-slider').css('margin-left'));

      for(index = 0; index < $scope.routerTabs.length; index++) {
        if($state.current.name == $scope.routerTabs[index].name) break;
      }

      indexWidth = (index + 1) * (TAB_WIDTH + MARGIN_WIDTH) - MARGIN_WIDTH;
      marginLeft = indexWidth > wrapperWidth ? wrapperWidth - indexWidth : 0;

      $element.find('.routertabs-slider').css('margin-left', marginLeft + 'px');
    }

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
            '<div class="pull-left clearfix dropdown" uib-dropdown>',
              '<a class="down-angle dropdown-toggle" uib-dropdown-toggle><i class="fa fa-angle-double-down"></i></a>',
              '<ul class="dropdown-menu" uib-dropdown-menu>',
                '<li ng-click="closeAll()"><a><i class="fa fa-times text-danger icon-left"></i>关闭所有标签</a></li>',
                '<li class="divider"><li>',
                '<li ng-click="select(routerTab)" ng-repeat="routerTab in routerTabs">',
                  '<a>',
                    '<i ng-class="{\'fa-check\': currentTabActive(routerTab)}" class="fa text-primary icon-left"></i><span class="text-ellipsis">{{routerTab.label}}</span>',
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
  })

  .service('uiRoutertabService', ['$rootScope', '$state', function ($rootScope, $state) {
    this.leaveCurrentPage = function () {
      var index = -1, currentTab, previousTab;

      for(var i  = 0; i < $rootScope.routerTabs.length; i++) {
        if($rootScope.routerTabs[i].name == $state.current.name) {
          index = i;
          break;
        }
      }

      currentTab = $rootScope.routerTabs[index];
      previousTab = $rootScope.routerTabs[index - 1];

      $rootScope.routerTabs.splice(index, 1);

      if (currentTab.active) {
        $state.go(previousTab.name, previousTab.params);
      }
    };
  }]);