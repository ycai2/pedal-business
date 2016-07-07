(function() {
    'use strict';

    angular
        .module('pedal')
        .controller('NavController', NavController);

    NavController.$inject = ['Auth'];

    /* @ngInject */
    function NavController(Auth) {
        var vm = this;
        vm.title = 'NavController';
        vm.firebaseUser = Auth.$onAuthStateChanged();

        activate();

        ////////////////

        function activate() {
          console.log(vm.firebaseUser);
        }
    }
})();