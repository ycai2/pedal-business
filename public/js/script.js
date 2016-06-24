(function() {
  'use strict';

  angular
    .module('pedal', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
      // For any unmatched url, redirect to /state1
      $urlRouterProvider.when("", "/404");
      $urlRouterProvider.otherwise("/404");


      $stateProvider
        .state('home', {
          url: "/",
          templateUrl: "pages/home.html"
        })
        .state('register', {
          url: "/register",
          templateUrl: "pages/register.html"
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
