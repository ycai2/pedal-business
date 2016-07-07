(function() {
    'use strict';

    angular.module('pedal')
        .run(["$rootScope", "$state", function($rootScope, $state) {
          $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireSignIn promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
              $state.go("signin");
            }
          });
        }])
        .config(function($stateProvider, $urlRouterProvider) { 
          // For any unmatched url, redirect to /404
          //$urlRouterProvider.otherwise("/");
          //
          // Now set up the states
          $stateProvider
            .state('register', {
              url: "/register",
              templateUrl: "views/register.html",
              controller: "RegisterController as registerCtrl",
            })
            .state('signin', {
              url: "/signin",
              templateUrl: "views/signin.html",
              controller: "SigninController as signinCtrl",
              resolve: {
                // controller will not be loaded until $waitForSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "currentAuth": ["Auth", function(Auth) {
                  // $waitForSignIn returns a promise so the resolve waits for it to complete
                  return Auth.$waitForSignIn();
                }]
              }
            })
            .state('profile', {
              url: "/profile",
              templateUrl: "views/profile.html",
              controller: "ProfileController as profileCtrl",
              resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the example above
                "currentAuth": ["Auth", function(Auth) {
                  // $requireSignIn returns a promise so the resolve waits for it to complete
                  // If the promise is rejected, it will throw a $stateChangeError (see above)
                  return Auth.$requireSignIn();
                }]
              }
            });

        });


})();