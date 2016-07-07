(function() {
    'use strict';

    angular
        .module('pedal')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = [];

    /* @ngInject */
    function ProfileController() {
        var vm = this;
        activate();

        ////////////////

        function activate() {
        }
    }
})();