(function() {
    'use strict';

    angular
        .module('pedal')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['Auth'];

    /* @ngInject */
    function RegisterController(Auth) {
        var vm = this;
        vm.title = 'Controller';
        vm.user = {};
        vm.register = createUser;

        activate();

        ////////////////

        function activate() {

        }

        function createUser() {
            vm.message = null;
            vm.error = null;

            Auth.$createUserWithEmailAndPassword(vm.user.username + "@pedal.com", vm.user.password)
                .then(function(firebaseUser) {
                    vm.message = "User created with uid: " + firebaseUser.uid;
                }).catch(function(error) {
                    vm.error = error;
                });
        }
    }
})();