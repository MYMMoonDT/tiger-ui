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
