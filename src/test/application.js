'use strict';
/* global angular */

var moduleName = 'baseApp';

(function () {
    angular.module(moduleName, [
    ]);
})();

// Define the main controller
function MainCtrl() {};

angular
    .module(moduleName)
    .controller('MainCtrl', MainCtrl);