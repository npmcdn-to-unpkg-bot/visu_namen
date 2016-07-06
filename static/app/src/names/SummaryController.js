/**
 * Created by mw on 03.07.16.
 */
(function () {
    angular.module('names').controller('SummaryController', [
        'namesService', '$timeout', '$log', '$scope',
        function (namesService, $timeout, $log, $scope) {
            var self = this;
            
            self.gender = "%";
            self.genders = {"beide" : '%', "Frauen" : "w", "Männer" : "m"};

            
            self.from = 1900;
            self.to = 2016;
            self.limit = 100;

            loadChartData();

            self.modelChanged = function () {
                loadChartData();
                $log.debug("cahnged: " + self.gender + " , " + self.from + " - " + self.to);
            };
            
            // *********************************
            // Internal methods
            // *********************************

            function loadChartData() {
                namesService.loadSummaryByQuery(self.from, self.to, self.gender, self.limit).then(function(data) {
                    $scope.summaryData = data.map(function (d) {
                        return {
                            name: d.vorname,
                            value: d.total,
                            geschlecht: d.geschlecht,
                            avg_anz: d.avg_anzahl,
                            min_anz: d.min_anzahl,
                            max_anz: d.max_anzahl,
                            first: d.first_year,
                            last: d.last_year
                        }
                    });
                });
            }
        }]);
})();