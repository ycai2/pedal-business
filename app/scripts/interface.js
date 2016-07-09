$(function(){
  var data = firebase.database();

  firebase.auth().onAuthStateChanged(function(user) {
    //console.log(firebase.auth().currentUser);
    if (user) {
      console.log('Interface user:', user.uid);
      data.ref('users/' + user.uid).once('value')
        .then(function(snapshot) {
          var info = snapshot.val().profile_info;

          //Set fields
          $('#business_name').val(info.business_name);
          $('#address').val(info.address);
          $('#email').val(info.email);
          $('#phone').val(info.phone);
          $('#delivery').prop('checked', true);

          Materialize.updateTextFields();  //Update input boxes with Materialize
        })
        .catch(function(error) {
          console.log(error);
        });

      $('.update-profile-btn').on('click tap', function() {
        data.ref('users/' + user.uid).set({
          profile_info: {
            business_name: $('#business_name').val(),
            address: $('#address').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            delivery: $('#delivery').is(':checked'),
          }
        })
        .then(function(){
          Materialize.toast('Profile record updated!', 3000);
        })
        .catch(function(error){
          console.log(error.message);
        })
      });
    } 
  });
});