(function() {
  'use strict';

  angular
    .module('pedal', ['ui.router', 'google.places'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
      // For any unmatched url, redirect to /state1
      $locationProvider.html5Mode(true);
      $urlRouterProvider.when("", "/");
      $urlRouterProvider.otherwise("/404");


      $stateProvider
        .state('home', {
          url: "/",
          templateUrl: "pages/home.html"
        })
        .state('register', {
          url: "/register",
          templateUrl: "pages/register.html",
          controller: "RegisterController"
        })
        .state('signin', {
          url: "/signin",
          templateUrl: "pages/signin.html"
        })
        .state('profile', {
          url: "/profile",
          templateUrl: "pages/profile.html"
        })
        .state('about', {
          url: "/about",
          templateUrl: "pages/about.html"
        })
        .state('404', {
          url: "/404",
          templateUrl: "pages/404.html"
        })
    })
    .controller('MainController', MainController)
    .controller('RegisterController', RegisterController);




  function MainController() {
    var vm = this;
    vm.message = 'Everyone come and see how good I look!';
  }

  function RegisterController() {
    var vm = this;
    vm.user = {};
    vm.place = null;
    vm.register = function(user) {

    };

  }

  // function AboutController() {
  //   var vm = this;
  //   vm.message = 'About page this is';
  // }
  // function ContactController() {
  //   var vm = this;
  //   vm.message = 'Contact page this is';
  // }
})();
