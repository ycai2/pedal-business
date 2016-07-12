$(function(){
  
  //var dayofweek = ['sunday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  firebase.auth().onAuthStateChanged(function(user) {
    //console.log(firebase.auth().currentUser);
    if (user) {
      console.log('Interface user:', user.uid);
      var data = firebase.database().ref('users/' + user.uid);
      var dayId = 0;

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
          console.log(error.message);
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
        //console.log($(e.target).data("dayId"));
        dayId = $(e.target).data("dayId");
        

        
      });

      //Add event to Firebase
      $('.modal-action').on('click tap', function(){
        if (dayId) {
          data.child('events/' + dayId).push({
            title: $('#event_title').val(),
            content: $('#event_content').val()
          }).then(function() {
            Materialize.toast('Event added!', 3000);
            $('#event_title').val('');
            $('#event_content').val(''); 
          }).catch(function() {
            console.log('There was an error.');
          });
        } else {
          console.log('No dayId specified.');
        }
      });

      data.child('events/').on('value', function(snapshot) {
        //console.log(snapshot.val());
        Object.keys(snapshot.val()).forEach(function(dayId) {
          updateEvent(dayId, snapshot.val()[dayId]);
        });
      });

      function updateEvent(dayId, event) {
        //Find specific day list
        var day = $('.event_list[data-day-id=' + dayId + ']')[0],
            event_list = $(day).find('ul')[0],
            formatted_card = '',
            new_list = document.createElement('ul');


        Object.keys(event).forEach(function (key) {
          var val = event[key];
          formatted_card = document.createElement('li');
          formatted_card.innerHTML = '<div class="card">' + 
                      '<h6 class="card-title center-align">' + val.title + '</h6>' + 
                      '<div class="card-content center-align">' + 
                        '<p>' + val.content + '</p>' + 
                      '</div>' +
                      '</div>';
          new_list.appendChild(formatted_card);
        });
        day.replaceChild(new_list, event_list);
      }
    } 
  });
});