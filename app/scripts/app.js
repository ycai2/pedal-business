$('.signin-btn').on("click tap", firebaseSignIn);
var firebaseSignIn = function() {
  alert('SIGNIN CLICKED');
  var username = $('#username');
  var password = $('#password');
  firebase.auth().signInWithEmailAndPassword(username + "@pedal.com", password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    Materialize.toast(errorMessage, 4000);
    // ...
  });
};