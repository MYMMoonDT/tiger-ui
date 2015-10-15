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
