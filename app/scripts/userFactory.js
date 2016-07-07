(function() {
    'use strict';

    angular
        .module('pedal')
        .factory('Auth', Auth);

    Auth.$inject = ['$firebaseAuth'];

    /* @ngInject */
    function Auth($firebaseAuth) {
        return $firebaseAuth();
    }

})();

