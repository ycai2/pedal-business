$(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('a user is signed in');
      $('#signup-form').closeModal();
      Materialize.toast('Account created!', 3000);

      var login = document.getElementById('login-card');
      login.setAttribute('hidden', 'true');
    } else {
      // No user is signed in.
      $('.modal-action').click(function(){

        var name = $('#new_business_name').val();
        var pw = $('#new_password').val();
        var pw_confirm = $('#new_password_confirm').val();

        var verified_u = null;
        var verified_p = null;

        if (!name) {
          Materialize.toast('Username is empty!', 3000, 'short-toast');
        } else if (!/(^\w+(-\w+)*$)/.test(name)) {
          Materialize.toast('Username must be lowercase letters connected by hyphens', 3000, 'short-toast');
        } else {
          verified_u = name;
        }

        if (!pw && !pw_confirm) {
          Materialize.toast('Password is empty', 3000, 'short-toast');
        }
        else if (pw != pw_confirm) {
          Materialize.toast('Passwords do not match!', 3000, 'short-toast');
        }
        else {
          verified_p = pw;
        }

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