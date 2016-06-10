<<<<<<< HEAD
var app = angular.module("pedal-business", ["firebase"]);

// let's create a re-usable factory that generates the $firebaseAuth instance
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

// and use it in our controller
app.controller("UserController", ["$scope", "Auth",
  function($scope, Auth) {
    $scope.createUser = function() {
      $scope.firebaseUser = null;
      $scope.message = null;
      $scope.error = null;

      //Make Pedal email
      var email = $scope.new_username + "@pedal.com";

      //Check password
      if ($scope.new_password == $scope.new_password_confirm){
        // Create a new user
        Auth.$createUserWithEmailAndPassword(email, $scope.new_password)
          .then(function(firebaseUser) {
            //$scope.message = "User created with uid: " + firebaseUser.uid;
            $scope.message = "User created.";
            Materialize.toast($scope.message, 3000);
            $('#signup-form').closeModal();

          }).catch(function(error) {
            $scope.error = error;
            Materialize.toast($scope.error, 3000);
          });
      } else {
        Materialize.toast('Passwords not matched!', 3000);
      }
    };

    $scope.signIn = function(username, password) {
      Auth.$signInWithEmailAndPassword(username+"@pedal.com", password).then(function(firebaseUser) {
        //console.log("Signed in as:", firebaseUser.uid);
        Materialize.toast("Signed in as" + firebaseUser.uid, 3000);
        $scope.firebaseUser = firebaseUser;
      }).catch(function(error) {
        //console.error("Authentication failed:", error);
        Materialize.toast(error, 3000);
      });
    };

    $scope.deleteUser = function() {
      $scope.message = null;
      $scope.error = null;

      // Delete the currently signed-in user
      Auth.$deleteUser().then(function() {
        $scope.message = "User deleted";
      }).catch(function(error) {
        $scope.error = error;
      });
    };
  }
]);
=======
angular.module("pedal-business", [])
.controller("userController", function($scope) {
  
});
>>>>>>> firebase-test-wyh
