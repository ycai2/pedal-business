var login = $('#login-card');
var interface = $('#interface-card');
var reg_username = /^[a-z]+[a-z0-9-_]*[a-z0-9]+$/;
$(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      interface.show();
      login.hide();
      $('#logout-btn').click(function() {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
          //login.show();
          //interface.hide();
        })
        .catch(function(error) {
          // An error happened.
          Materialize.toast(error.message, 3000);
        });
      });

      

    } else {
      // No user is signed in.
      interface.hide();
      login.show();
      $('#login-btn').click(function() {
        var username = $('#username').val();
        var pw = $('#password').val();
        $('#password').val("");          //clear password for security reason at front-end

        
        if (reg_username.test(username)){
          firebase.auth().signInWithEmailAndPassword(username + "@pedal.com", pw).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
            Materialize.toast(errorMessage, 3000);
            // ...
          });
        }
        else{
          console.log("Regex test failed. ")
          Materialize.toast("Please enter a correct username", 3000);
        }
      });
    }
  });


  
});