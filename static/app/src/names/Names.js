/**
 * Created by mw on 02.07.16.
 */
(function(){
  'use strict';

  // Prepare the 'names' module for subsequent registration of controllers and delegates
  angular.module('names', [ 'ngMaterial' , 'ngMessages']).config(['$mdIconProvider', function($mdIconProvider) {
        $mdIconProvider.icon('md-close', 'img/icons/ic_close_24px.svg', 24);
      }]);

    
})();

