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
