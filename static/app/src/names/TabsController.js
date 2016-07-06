/**
 * Created by mw on 03.07.16.
 */
(function () {
    angular.module('names').controller('TabsController', [
        '$log', '$scope',
        function ($log, $scope) {
            var self = this;

            self.selectedIndex = 0;

            self.selectLineChartTab = function (name) {
                self.selectedIndex = 1;
                $log.debug("select tab for " + name);
            };
        }]);
})();