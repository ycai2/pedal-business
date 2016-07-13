$(function(){
  
  //var dayofweek = ['sunday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  firebase.auth().onAuthStateChanged(function(user) {
    //console.log(firebase.auth().currentUser);
    if (user) {
      console.log('Interface user:', user.uid);
      var data = firebase.database().ref('users/' + user.uid);
      var dayId, eventId = 0;

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
        console.log($('#event-type').val());
        if (dayId && ($('#event-type').val() == 'event')) {
          data.child('events/' + dayId).push({
            title: $('#event_title').val(),
            content: $('#event_content').val(),
            type: $('#event-type').val()
          }).then(function() {
            Materialize.toast('Event added!', 3000);
            $('#event_title').val('');
            $('#event_content').val(''); 
            $('#event-type').val(''); 
          }).catch(function() {
            console.log('There was an error.');
          });
        }
        else if (dayId && ($('#event-type').val() == 'deal')) {
          data.child('deals/' + dayId).push({
            title: $('#event_title').val(),
            content: $('#event_content').val(),
            type: $('#event-type').val()
          }).then(function() {
            Materialize.toast('Deal added!', 3000);
            $('#event_title').val('');
            $('#event_content').val(''); 
            $('#event-type').val(''); 
          }).catch(function() {
            console.log('There was an error.');
          });
        }
        else {
          console.log('No dayId specified.');
        }
      });

      data.child('events/').on('value', function(snapshot) {
        for (var i = 0; i < 7; ++i) {
          if (snapshot.val()){
            updateEvent(i, snapshot.val()[i]);
          }
          else {
            updateEvent(i, null);
          }
        }      
      });

      function updateEvent(day_key, event) {
        //Find specific day list
        var day = $('.event_list[data-day-id=' + day_key + ']')[0],
            event_list = $(day).find('ul')[0],
            formatted_card = '',
            new_list = document.createElement('ul');

        if (event){
          Object.keys(event).forEach(function (key) {
            var val = event[key];
            formatted_card = document.createElement('li');
            formatted_card.innerHTML = '<div class="card">' + 
                        '<h6 class="card-title center-align">' + val.title + '</h6>' + 
                        '<div class="card-content center-align">' + 
                          '<p>' + val.content + '</p>' + 
                          '<a class="waves-effect waves-light btn delete_event" data-event-id='+ key +'>Delete</a>' +
                        '</div>' +
                        '</div>';

            new_list.appendChild(formatted_card);

            $(formatted_card).on('click tap', function(e){
              eventId = $(e.target).data("eventId");

              var deleteRef = firebase.database().ref('users/' + user.uid + '/events/' + day_key + '/' + eventId);
              deleteRef.remove();
              console.log(eventId);
            });
            
          });
        }
        day.replaceChild(new_list, event_list);
      }
    } 
  });
});