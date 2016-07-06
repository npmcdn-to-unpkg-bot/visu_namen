/**
 * Created by mw on 02.07.16.
 */

(function () {
    angular.module('names').controller('NamesController', [
        'namesService', '$timeout', '$log', '$scope',
        function (namesService, $timeout, $log, $scope) {
            var self = this;

            $scope.chartData = [];

            // ******************************
            // names chip
            // ******************************
            // Lists names and name objects
            self.names = ['Barbara', 'Lars', 'Martin'];

            loadCompleteChart();

            self.addChip = function (chip) {
                $log.debug("add chip " + chip);
                loadChartData(chip);
            };

            self.removeChip = function (chip) {
                $log.debug("remove chip " + chip);
                resetChartData();
                loadCompleteChart();
            };


            // *********************************
            // Internal methods
            // *********************************
            function resetChartData(){
                $scope.chartData = []
            }

            function loadCompleteChart() {
                for (var i = 0; i <  self.names.length; i++) {
                    loadChartData(self.names[i]);
                }
            }

            function loadChartData(newName) {
                namesService.loadByName(newName).then(function (data) {
                    $scope.chartData = [].concat($scope.chartData, data);
                });
            }
        }]);
})();

