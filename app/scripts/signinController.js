(function() {
    'use strict';

    angular
        .module('pedal')
        .controller('SigninController', SigninController);

    SigninController.$inject = ['Auth'];

    /* @ngInject */
    function SigninController(Auth) {
        var vm = this;
        vm.credentials = {};
        vm.user = Auth.$getAuth();
        vm.signin = signin;
        

        activate();

        ////////////////

        function activate() {
        }

        function signin() {
            vm.message = null;
            vm.error = null;

            Auth.$signInWithEmailAndPassword(vm.credentials.username + "@pedal.com", vm.credentials.password)
                .then(function(firebaseUser) {
                    console.log("Signed in as:", firebaseUser.uid);
                    vm.message = "Signed in as: " + firebaseUser.uid;
                }).catch(function(error) {
                    vm.error = error.message;
                });
        }
    }
})();