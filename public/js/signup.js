var login = document.getElementById('login-card');
var interface = document.getElementById('interface-card');
$(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('a user is signed in');
      $('#signup-form').closeModal();
      
      login.setAttribute('hidden', 'true');
      interface.removeAttribute('hidden');

      $('#logout-btn').click(function() {
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
          login.removeAttribute('hidden');
          interface.setAttribute('hidden', 'true');
        }, function(error) {
          // An error happened.
          Materialize.toast(error.message, 3000);
        });
      });

      

    } else {
      // No user is signed in.
      interface.setAttribute('hidden', 'true');
      $('#login-btn').click(function() {
        var username = $('#username').val();
        var pw = $('#password').val();
        $('#password').val("");          //clear password for security reason at front-end

        firebase.auth().signInWithEmailAndPassword(username + "@pedal.com", pw).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          Materialize.toast(errorMessage, 3000);
          // ...
        });
      });

      $('.modal-action').click(function(){

        var name = $('#new_business_name').val();
        var pw = $('#new_password').val();
        var pw_confirm = $('#new_password_confirm').val();

        var verified_u = null;
        var verified_p = null;

        //Validate username.
        if (!name) {
          Materialize.toast('Username is empty!', 3000, 'short-toast');
        } else if (!/(^\w+(-\w+)*$)/.test(name)) {
          Materialize.toast('Username must be lowercase letters connected by hyphens', 3000, 'short-toast');
        } else {
          verified_u = name;
        }

        //Validate password
        if (!pw && !pw_confirm) {
          Materialize.toast('Password is empty', 3000, 'short-toast');
        }
        else if (pw != pw_confirm) {
          Materialize.toast('Passwords do not match!', 3000, 'short-toast');
        }
        else {
          verified_p = pw;
        }

        //If both valid, create the account
        if (verified_u && verified_p) {
          console.log('signup');
          firebase.auth().createUserWithEmailAndPassword(verified_u + "@pedal.com", verified_p).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            Materialize.toast(errorMessage, 3000, 'short-toast');
            // ...
          });
        }


        

      });
    }
  });


  
});