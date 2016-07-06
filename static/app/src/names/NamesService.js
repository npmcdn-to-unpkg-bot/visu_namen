/**
 * Created by mw on 02.07.16.
 */

(function () {
    'use strict';

    angular.module('names').service('namesService', ['$http', NamesService]);

    /**
     * Names DataService
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
    function NamesService($http) {
        var names = [];

        // Promise-based API
        return {
            loadSummaryByTotalDesc: function(){
                var promise = $http.get('/api/summary/bytotal');
                promise = promise.then(function (response) {
                    return response.data;
                });
                return promise;
            },

            loadSummaryByQuery: function(from, to, gender, limit){
                var promise = $http.get('/api/summary/byquery?from='+from+'&to='+to+'&gender='+gender+'&limit='+limit);
                promise = promise.then(function (response) {
                    return response.data;
                });
                return promise;
            },

            loadAllNames: function () {
                var promise = $http.get('/api/people/all');
                promise = promise.then(function (response) {
                    return response.data;
                });
                return promise;
            },

            loadAllNamesInPeriod: function (startYear, endYear) {
                // todo
            },

            loadByName: function (name) {
                var promise = $http.get('/api/people/byname/' + name);
                promise = promise.then(function (response) {
                    return response.data;
                });
                return promise;
            }
        };
    }

})();

