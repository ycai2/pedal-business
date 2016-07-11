$(function(){
  
  //var dayofweek = ['sunday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  firebase.auth().onAuthStateChanged(function(user) {
    //console.log(firebase.auth().currentUser);
    if (user) {
      console.log('Interface user:', user.uid);
      var data = firebase.database().ref('users/' + user.uid);



      data.once('value')
        .then(function(snapshot) {
          var profile_info = snapshot.val().profile_info;
          

          //Set profile fields
          $('#business_name').val(profile_info.business_name);
          $('#address').val(profile_info.address);
          $('#email').val(profile_info.email);
          $('#phone').val(profile_info.phone);
          $('#delivery').prop('checked', true);

          Materialize.updateTextFields();  //Update input boxes with Materialize
        })
        .catch(function(error) {
          console.log(error);
        });

      $('.update-profile-btn').on('click tap', function() {
        data.child('profile_info').set({
          
          business_name: $('#business_name').val(),
          address: $('#address').val(),
          email: $('#email').val(),
          phone: $('#phone').val(),
          delivery: $('#delivery').is(':checked'),
          
        })
        .then(function(){
          Materialize.toast('Profile record updated!', 3000);
        })
        .catch(function(error){
          console.log(error.message);
        })
      });

      $('.add_event').on('click tap', function(e) {
        $('#event_modal').openModal();
        console.log(e.target);
      });
      // $('.add_event').each(function(index){
      //   $(this).on('click tap', function(){
      //     //console.log(index + " add clicked!");
      //     $('#event_modal').openModal();
      //   });
      //   $('.modal-action').on('click tap', function(){
      //     console.log(index + " add clicked!");
      //   });

        // $('.modal-action').on('click tap', function(){

        //   data.child('events/'+index).push({
        //     title: $('#event_title').val(),
        //     content: $('#event_content').val()
        //   }).then(function() {

        //     $('#event_title').val('');
        //     $('#event_content').val(''); 
        //   }).catch(function() {
        //     console.log('There was an error.');
        //   });

        //   // var event = {
        //   //   day: index,
        //   //   title: $('#event_title').val(),
        //   //   content: $('#event_content').val()
        //   // };
        //   // console.log(event);
          
        //   // data.push()
        // });
      //});
      
    } 
  });
});